"use client";

import { useEffect, useRef } from "react";
import { cn } from "cn";

const ART = [
  "██████╗   █████╗  ██╗  ██╗",
  "██╔══██╗ ██╔══██╗ ██║ ██╔╝",
  "██████╔╝ ███████║ █████╔╝ ",
  "██╔══██╗ ██╔══██║ ██╔═██╗ ",
  "██║  ██║ ██║  ██║ ██║  ██╗",
  "╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚═╝  ╚═╝",
];

const GLYPHS = "01ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ<>[]{}#%&*+-=/\\|";

export function AsciiWordmark({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const spans = Array.from(root.querySelectorAll<HTMLSpanElement>("[data-ch]"));
    const originals = spans.map((span) => span.dataset.ch ?? "");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const started = performance.now();
    const revealMs = 900;

    let centers: { x: number; y: number }[] = [];
    let pointer = { x: -9999, y: -9999 };
    let burstUntil = 0;
    let revealing = !reduced;
    let raf = 0;

    const measure = () => {
      centers = spans.map((span) => {
        const rect = span.getBoundingClientRect();
        return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
      });
    };
    measure();

    const randomGlyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

    const frame = (now: number) => {
      if (revealing) {
        const progress = Math.min((now - started) / revealMs, 1);
        const keep = Math.floor(progress * spans.length);
        for (let i = 0; i < spans.length; i++) {
          if (!originals[i].trim()) continue;
          spans[i].textContent = i < keep ? originals[i] : randomGlyph();
        }
        if (progress >= 1) {
          revealing = false;
          if (!finePointer) return;
        }
      } else if (finePointer) {
        const bursting = now < burstUntil;
        for (let i = 0; i < spans.length; i++) {
          if (!originals[i].trim()) continue;
          if (bursting) {
            spans[i].textContent = randomGlyph();
            continue;
          }
          const center = centers[i];
          const distance = Math.hypot(center.x - pointer.x, center.y - pointer.y);
          if (distance < 76) {
            spans[i].textContent = Math.random() < 0.55 ? randomGlyph() : originals[i];
          } else if (spans[i].textContent !== originals[i]) {
            spans[i].textContent = originals[i];
          }
        }
      }
      raf = requestAnimationFrame(frame);
    };

    if (reduced) {
      spans.forEach((span, index) => {
        span.textContent = originals[index];
      });
    } else {
      raf = requestAnimationFrame(frame);
    }

    const onMove = (event: PointerEvent) => {
      pointer = { x: event.clientX, y: event.clientY };
    };
    const onResize = () => measure();
    const onBurst = () => {
      burstUntil = performance.now() + 220;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("pointerdown", onBurst);
    void document.fonts?.ready.then(measure);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointerdown", onBurst);
    };
  }, []);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="RAK"
      className={cn(
        "select-none whitespace-pre font-mono leading-[1.02] tracking-[0.01em] text-ctos-fg",
        className,
      )}
    >
      {ART.map((line, lineIndex) => (
        <div key={lineIndex} className="whitespace-pre">
          {Array.from(line).map((char, charIndex) => (
            <span key={charIndex} data-ch={char} aria-hidden="true">
              {char}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}
