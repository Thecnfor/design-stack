"use client";

import { useEffect, useRef } from "react";

const CONFIG = {
  full: { cell: 22, alpha: 0.22, fps: 24, trail: 9, speed: [0.4, 1.2], pulse: true, streams: 1 },
  medium: { cell: 40, alpha: 0.12, fps: 18, trail: 6, speed: [0.3, 0.9], pulse: false, streams: 1 },
  low: { cell: 72, alpha: 0.06, fps: 10, trail: 4, speed: [0.2, 0.6], pulse: false, streams: 1 },
  hud: { cell: 48, alpha: 0.08, fps: 10, trail: 5, speed: [0.2, 0.7], pulse: true, streams: 1 },
  off: { cell: 72, alpha: 0.04, fps: 1, trail: 3, speed: [0, 0], pulse: false, streams: 1 },
} as const;

const GLYPHS = "01ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ<>[]{}#%&*+-=/\\|";

export function AsciiStorm() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let width = 0;
    let height = 0;
    let config = CONFIG.full;
    let columns: { x: number; y: number; y2: number; speed: number; speed2: number; len: number; len2: number }[] = [];
    let raf = 0;
    let running = false;
    let last = 0;
    let pulseAt = performance.now() + 8000;

    const build = () => {
      const tier = (document.documentElement.dataset.storm ?? "full") as keyof typeof CONFIG;
      const base = CONFIG[tier] ?? CONFIG.full;
      const mobile = window.innerWidth < 640;
      config = mobile ? { ...base, cell: Math.round(base.cell * 1.6), streams: 1, fps: Math.min(base.fps, 18) } : base;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${Math.max(10, Math.floor(config.cell * 0.72))}px ui-monospace, monospace`;
      ctx.textBaseline = "top";

      columns = Array.from({ length: Math.ceil(width / config.cell) }, (_, i) => ({
        x: i * config.cell,
        y: Math.random() * height,
        y2: Math.random() * height,
        speed: config.speed[0] + Math.random() * (config.speed[1] - config.speed[0]),
        speed2: config.speed[0] + Math.random() * (config.speed[1] - config.speed[0]),
        len: Math.max(3, Math.floor(config.trail * (0.5 + Math.random() * 0.8))),
        len2: Math.max(3, Math.floor(config.trail * (0.4 + Math.random() * 0.7))),
      }));
    };

    const paint = (now: number, dt: number) => {
      ctx.clearRect(0, 0, width, height);

      let pulse = 1;
      if (config.pulse && now >= pulseAt) {
        const t = (now - pulseAt) / 900;
        if (t < 1) pulse = 1 + Math.sin(t * Math.PI) * 0.9;
        else pulseAt = now + 9000 + Math.random() * 12000;
      }

      const step = Math.min(dt / 16.67, 2);
      for (const c of columns) {
        const heads = config.streams > 1 ? [{ y: c.y, len: c.len }, { y: c.y2, len: c.len2 }] : [{ y: c.y, len: c.len }];
        for (const head of heads) {
          for (let i = 0; i < head.len; i++) {
            const y = head.y - i * config.cell * 0.82;
            if (y < -config.cell || y > height) continue;
            const fade = (1 - i / head.len) * config.alpha * pulse;
            if (fade <= 0.01) continue;
            const roll = Math.random();
            ctx.fillStyle = i === 0
              ? roll > 0.96 ? `rgba(239,169,194,${fade * 1.4})` : roll > 0.93 ? `rgba(199,126,153,${fade})` : `rgba(245,242,244,${Math.min(1, fade * 1.8)})`
              : roll > 0.97 ? `rgba(239,169,194,${fade * 0.7})` : `rgba(245,242,244,${fade * 0.75})`;
            ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], c.x, y);
          }
        }
        c.y += c.speed * config.cell * 0.09 * step * pulse;
        c.y2 += c.speed2 * config.cell * 0.09 * step * pulse;
        if (c.y - c.len * config.cell > height) { c.y = -Math.random() * height * 0.3; c.len = Math.max(3, Math.floor(config.trail * (0.5 + Math.random() * 0.8))); }
        if (c.y2 - c.len2 * config.cell > height) { c.y2 = -Math.random() * height * 0.3; c.len2 = Math.max(3, Math.floor(config.trail * (0.4 + Math.random() * 0.7))); }
      }
    };

    const loop = (now: number) => {
      if (!running) return;
      raf = requestAnimationFrame(loop);
      if (now - last < 1000 / config.fps) return;
      const dt = last ? now - last : 16.67;
      last = now;
      paint(now, dt);
    };

    const start = () => { if (running || reduced) return; running = true; last = 0; raf = requestAnimationFrame(loop); };
    const stop = () => { running = false; cancelAnimationFrame(raf); };

    build();
    if (reduced) paint(performance.now(), 0); else start();

    const onResize = () => { build(); if (reduced) paint(performance.now(), 0); };
    const onVisibility = () => { if (document.hidden) stop(); else if (!reduced) start(); };
    const observer = new MutationObserver(() => { build(); if (reduced) paint(performance.now(), 0); });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-storm"] });

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 opacity-90" />;
}
