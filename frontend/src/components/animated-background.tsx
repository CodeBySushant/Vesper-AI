"use client";
import { motion } from "framer-motion";

/**
 * Ambient atmosphere: drifting blobs + radial light + grain.
 * All motion is transform/opacity only (GPU-accelerated), with very long
 * loops and tiny ranges — felt, not noticed. No WebGL / Three.js.
 */
export function AnimatedBackground({ variant = "hero" }: { variant?: "hero" | "subtle" }) {
  const intensity = variant === "hero" ? 1 : 0.55;
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* Layer 1 — base radial wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 70% 0%, rgb(var(--accent) / 0.10), transparent 55%), radial-gradient(90% 70% at 12% 18%, rgb(var(--accent-soft) / 0.5), transparent 60%)",
          opacity: intensity,
        }}
      />

      {/* Layer 2 — drifting organic blobs */}
      <motion.div
        className="absolute -left-[12%] top-[8%] h-[42vw] w-[42vw] rounded-full blur-[90px]"
        style={{ background: "radial-gradient(circle at 30% 30%, rgb(var(--accent) / 0.22), transparent 70%)", opacity: intensity }}
        animate={{ x: [0, 34, 0], y: [0, -18, 0] }}
        transition={{ duration: 46, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[2%] top-[2%] h-[36vw] w-[36vw] rounded-full blur-[100px]"
        style={{ background: "radial-gradient(circle at 60% 40%, rgb(217 119 36 / 0.16), transparent 70%)", opacity: intensity }}
        animate={{ x: [0, -22, 0], y: [0, 26, 0] }}
        transition={{ duration: 54, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute left-[38%] top-[34%] h-[30vw] w-[30vw] rounded-full blur-[110px]"
        style={{ background: "radial-gradient(circle at 50% 50%, rgb(var(--accent) / 0.14), transparent 70%)", opacity: intensity }}
        animate={{ scale: [0.95, 1.06, 0.95] }}
        transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Layer 3 — soft top sheen / ambient light */}
      <motion.div
        className="absolute inset-x-0 top-0 h-[60%]"
        style={{ background: "linear-gradient(to bottom, rgb(var(--surface) / 0.6), transparent)" }}
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Layer 4 — fine grain */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* fade to page bg at the bottom for a clean seam */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-bg" />
    </div>
  );
}
