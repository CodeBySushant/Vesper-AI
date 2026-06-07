"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Phone, Sparkles } from "lucide-react";
import { transcript } from "@/lib/data";

function Waveform({ active }: { active: boolean }) {
  return (
    <div className="flex items-center gap-[3px] h-8">
      {Array.from({ length: 28 }).map((_, i) => (
        <motion.span
          key={i}
          className="w-[3px] rounded-full bg-accent"
          animate={active ? { height: [6, 8 + ((i * 7) % 22), 6] } : { height: 6 }}
          transition={{ duration: 0.6 + (i % 5) * 0.12, repeat: Infinity, ease: "easeInOut", delay: i * 0.03 }}
        />
      ))}
    </div>
  );
}

export function CallCard({ compact = false }: { compact?: boolean }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s + 1) % (transcript.length + 1)), 2200);
    return () => clearInterval(id);
  }, []);
  const shown = transcript.slice(0, step);
  const speaking = step < transcript.length;

  return (
    <div className={`rounded-2xl border border-border bg-surface/90 backdrop-blur-xl shadow-lift overflow-hidden ${compact ? "w-full" : "w-full max-w-[420px]"}`}>
      <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="relative grid h-9 w-9 place-items-center rounded-full bg-accent-soft">
            <Phone size={15} className="text-accent" />
            <span className="absolute inset-0 rounded-full ring-2 ring-accent/40 animate-[pulse-ring_2s_ease-out_infinite]" />
          </span>
          <div>
            <p className="text-[13px] font-600 leading-tight">Aastha — Clinic</p>
            <p className="text-[11px] text-faint">Live · Nepali + English</p>
          </div>
        </div>
        <span className="flex items-center gap-1.5 text-[11px] font-500 text-positive">
          <span className="h-1.5 w-1.5 rounded-full bg-positive animate-pulse" /> 0:{String(24 + step * 3).padStart(2, "0")}
        </span>
      </div>

      <div className="h-[260px] space-y-2.5 overflow-y-auto scrollbar-thin px-5 py-4">
        <AnimatePresence initial={false}>
          {shown.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${m.who === "agent" ? "justify-start" : "justify-end"}`}
            >
              <div className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-[13px] leading-snug ${m.who === "agent" ? "bg-elevated text-ink rounded-tl-md" : "bg-accent text-white rounded-tr-md"}`}>
                {m.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between border-t border-border px-5 py-3">
        <Waveform active={speaking} />
        <span className="flex items-center gap-1.5 rounded-full bg-elevated px-2.5 py-1 text-[11px] font-500 text-muted">
          <Sparkles size={11} className="text-accent" /> {speaking ? "Listening…" : "Call complete"}
        </span>
      </div>
    </div>
  );
}
