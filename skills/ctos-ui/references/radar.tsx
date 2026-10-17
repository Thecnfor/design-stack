import { cn } from "cn";

export function Radar({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("relative size-40", className)}>
      <div className="absolute inset-0 rounded-full border border-ctos-border" />
      <div className="absolute inset-5 rounded-full border border-ctos-border/70" />
      <div className="absolute inset-10 rounded-full border border-ctos-border/50" />
      <div className="absolute left-1/2 top-0 h-full w-px bg-ctos-border/50" />
      <div className="absolute left-0 top-1/2 h-px w-full bg-ctos-border/50" />
      <div className="radar-sweep absolute inset-0 rounded-full" />
      <span className="absolute left-[62%] top-[26%] size-1.5 rounded-full bg-ctos-pink shadow-[0_0_10px_var(--ctos-pink)]" />
      <span className="absolute left-[30%] top-[58%] size-1 rounded-full bg-ctos-pink/80 shadow-[0_0_8px_var(--ctos-pink)]" />
      <span className="absolute left-[70%] top-[70%] size-1 rounded-full bg-ctos-pink-soft/80 shadow-[0_0_8px_var(--ctos-pink-soft)]" />
      <span className="absolute -top-4 left-1/2 -translate-x-1/2 font-mono text-[8px] uppercase tracking-[0.2em] text-ctos-fg-dim">
        scan
      </span>
      <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 font-mono text-[8px] text-ctos-fg-dim">
        360°
      </span>
    </div>
  );
}
