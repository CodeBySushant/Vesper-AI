"use client";
import { cn } from "@/lib/cn";
import { useTheme } from "./theme-provider";
import { Moon, Sun } from "lucide-react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="relative grid h-8 w-8 place-items-center rounded-[10px] bg-ink text-bg">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M4 12c2.5 0 2.5-7 5-7s2.5 14 5 14 2.5-7 5-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </span>
      <span className="font-display text-[19px] font-600 tracking-tight">Vesper</span>
    </div>
  );
}

export function Button({
  children, variant = "primary", size = "md", className, ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "outline"; size?: "sm" | "md" | "lg" }) {
  const variants = {
    primary: "bg-ink text-bg hover:opacity-90 shadow-soft",
    secondary: "bg-accent text-white hover:brightness-110 shadow-glow",
    outline: "border border-border bg-surface hover:bg-elevated text-ink",
    ghost: "text-muted hover:text-ink hover:bg-elevated",
  };
  const sizes = { sm: "h-8 px-3 text-[13px]", md: "h-10 px-4 text-sm", lg: "h-12 px-6 text-[15px]" };
  return (
    <button
      className={cn("inline-flex items-center justify-center gap-2 rounded-xl font-500 transition-all active:scale-[0.98] disabled:opacity-50", variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

export function MagneticButton({
  children, variant = "primary", size = "lg", className,
}: { children: React.ReactNode; variant?: "primary" | "secondary" | "outline"; size?: "md" | "lg" } & { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    x.set(mx * 0.25);
    y.set(my * 0.35);
  }
  function reset() { x.set(0); y.set(0); }

  const variants = {
    primary: "bg-ink text-bg shadow-soft",
    secondary: "bg-accent text-white shadow-glow",
    outline: "border border-border bg-surface/70 backdrop-blur text-ink",
  };
  const sizes = { md: "h-10 px-5 text-sm", lg: "h-12 px-7 text-[15px]" };

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={reset} style={{ x: sx, y: sy }} className="inline-block">
      <motion.button
        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className={cn("inline-flex items-center justify-center gap-2 rounded-xl font-500 transition-shadow hover:shadow-lift", variants[variant], sizes[size], className)}
      >
        {children}
      </motion.button>
    </motion.div>
  );
}

export function Badge({ children, tone = "neutral", className }: { children: React.ReactNode; tone?: "neutral" | "positive" | "warn" | "danger" | "accent"; className?: string }) {
  const tones = {
    neutral: "bg-elevated text-muted border-border",
    positive: "bg-positive/10 text-positive border-positive/20",
    warn: "bg-warn/10 text-warn border-warn/20",
    danger: "bg-danger/10 text-danger border-danger/20",
    accent: "bg-accent-soft text-accent border-accent/20",
  };
  return <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[12px] font-500", tones[tone], className)}>{children}</span>;
}

export function Card({ children, className, hover = false }: { children: React.ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-surface", hover && "transition-all hover:shadow-lift hover:-translate-y-0.5", className)}>{children}</div>
  );
}

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} aria-label="Toggle theme" className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface text-muted transition-colors hover:text-ink">
      <motion.span key={theme} initial={{ rotate: -30, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} transition={{ duration: 0.25 }}>
        {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      </motion.span>
    </button>
  );
}

export function Sparkline({ data, color }: { data: number[]; color?: string }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * 100},${28 - ((v - min) / (max - min || 1)) * 24}`).join(" ");
  return (
    <svg viewBox="0 0 100 28" className="h-7 w-full" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={color ?? "rgb(var(--accent))"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
