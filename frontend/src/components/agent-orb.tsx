"use client";
import { motion } from "framer-motion";
import { useState } from "react";

/**
 * The hero centerpiece. A soft organic orb that breathes when idle and
 * emits slow expanding voice-pulse rings. Hover lifts and brightens it.
 * Pure CSS/SVG + transform/opacity motion — no canvas, no WebGL.
 */
export function AgentOrb() {
  const [hover, setHover] = useState(false);

  return (
    <div className="relative grid place-items-center" style={{ width: 420, height: 420, maxWidth: "100%" }}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>

      {/* Expanding voice-pulse rings */}
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute rounded-full border border-accent/30"
          style={{ width: 220, height: 220 }}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: [0.7, 1.8], opacity: [0.35, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeOut", delay: i * 2 }}
        />
      ))}

      {/* Ambient halo */}
      <motion.div
        className="absolute rounded-full blur-3xl"
        style={{ width: 320, height: 320, background: "radial-gradient(circle, rgb(var(--accent) / 0.4), transparent 70%)" }}
        animate={{ opacity: hover ? 0.9 : [0.45, 0.65, 0.45], scale: hover ? 1.08 : [1, 1.05, 1] }}
        transition={{ duration: hover ? 0.8 : 8, repeat: hover ? 0 : Infinity, ease: "easeInOut" }}
      />

      {/* The orb — breathing */}
      <motion.div
        className="relative grid place-items-center rounded-full"
        style={{ width: 220, height: 220 }}
        animate={{ scale: hover ? 1.04 : [1, 1.035, 1] }}
        transition={{ duration: hover ? 0.9 : 7, repeat: hover ? 0 : Infinity, ease: "easeInOut" }}
      >
        {/* Slowly rotating warm-cool gradient core */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, rgb(var(--accent)), rgb(217 119 36), rgb(var(--accent-soft)), rgb(var(--accent)))",
            filter: "blur(2px)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        />
        {/* Inner light + glass */}
        <div className="absolute inset-[3px] rounded-full" style={{ background: "rgb(var(--surface))" }} />
        <motion.div
          className="absolute inset-[3px] rounded-full"
          style={{ background: "radial-gradient(circle at 36% 30%, rgb(255 255 255 / 0.85), transparent 55%), radial-gradient(circle at 70% 78%, rgb(var(--accent) / 0.35), transparent 60%)" }}
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Center waveform glyph */}
        <div className="relative z-10 flex items-end gap-[5px] h-12">
          {[0.45, 0.8, 0.3, 1, 0.55, 0.85, 0.4].map((h, i) => (
            <motion.span
              key={i}
              className="w-[4px] rounded-full bg-ink/80"
              animate={{ scaleY: [h * 0.6, h, h * 0.6] }}
              style={{ height: 40, originY: 1 }}
              transition={{ duration: 1.8 + i * 0.18, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>
      </motion.div>

      {/* Orbiting micro-satellites for depth */}
      {[{ d: 30, r: 150, s: 7 }, { d: 0, r: 178, s: 5 }].map((o, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{ width: o.r * 2, height: o.r * 2 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 50 + i * 18, repeat: Infinity, ease: "linear" }}
        >
          <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-accent/50 blur-[1px]" />
        </motion.div>
      ))}
    </div>
  );
}
