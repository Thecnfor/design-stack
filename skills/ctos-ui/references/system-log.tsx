"use client";

import { useEffect, useState } from "react";
import { cn } from "cn";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const BOOT = [
  "boot ctos kernel ........ ok",
  "mount /storm (ascii) .... ok",
  "uplink node_07 .......... 98%",
];

const ROTATING = [
  "scanning local network ...",
  "indexing transmissions ...",
  "storm density nominal ...",
  "signal integrity stable ...",
];

export function SystemLog({ className }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => {
      setIndex((value) => (value + 1) % ROTATING.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [reduced]);

  const status = reduced ? ROTATING[0] : ROTATING[index];

  return (
    <div
      aria-hidden="true"
      className={cn(
        "border border-ctos-border/70 bg-ctos-surface/60 px-4 py-2.5 font-mono text-[10px] leading-5 text-ctos-fg-dim backdrop-blur-sm",
        className,
      )}
    >
      <div className="mb-1 flex items-center justify-between text-[9px] uppercase tracking-[0.22em] text-ctos-fg-dim/80">
        <span>system.log</span>
        <span className="text-ctos-cyan/70">live</span>
      </div>
      {BOOT.map((line) => (
        <p key={line}>
          <span className="text-ctos-cyan/60">&gt;</span> {line}
        </p>
      ))}
      <p className="caret text-ctos-fg-muted">
        <span className="text-ctos-cyan/60">&gt;</span> {status}
      </p>
    </div>
  );
}
