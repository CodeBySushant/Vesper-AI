"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, CornerDownLeft } from "lucide-react";
import { agents, calls, campaigns } from "@/lib/data";

type Item = { label: string; sub: string; href: string };

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();

  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setOpen((o) => !o); }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);

  const items: Item[] = [
    { label: "Overview", sub: "Page", href: "/dashboard" },
    { label: "Agents", sub: "Page", href: "/dashboard/agents" },
    { label: "Agent Builder", sub: "Page", href: "/dashboard/agents/builder" },
    { label: "Calls", sub: "Page", href: "/dashboard/calls" },
    { label: "Campaigns", sub: "Page", href: "/dashboard/campaigns" },
    { label: "Analytics", sub: "Page", href: "/dashboard/analytics" },
    { label: "Knowledge Base", sub: "Page", href: "/dashboard/knowledge" },
    { label: "Phone Numbers", sub: "Page", href: "/dashboard/numbers" },
    { label: "Team", sub: "Page", href: "/dashboard/team" },
    { label: "Billing", sub: "Page", href: "/dashboard/billing" },
    { label: "Settings", sub: "Page", href: "/dashboard/settings" },
    ...agents.map((a) => ({ label: a.name, sub: "Agent", href: "/dashboard/agents" })),
    ...campaigns.map((c) => ({ label: c.name, sub: "Campaign", href: "/dashboard/campaigns" })),
    ...calls.slice(0, 4).map((c) => ({ label: `${c.caller} · ${c.agent}`, sub: "Call", href: "/dashboard/calls" })),
  ];
  const filtered = q ? items.filter((i) => i.label.toLowerCase().includes(q.toLowerCase())) : items.slice(0, 8);

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-ink/30 p-4 pt-[18vh] backdrop-blur-sm" onClick={() => setOpen(false)}>
          <motion.div initial={{ scale: 0.97, y: -8 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.97, opacity: 0 }}
            onClick={(e) => e.stopPropagation()} className="w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface shadow-lift">
            <div className="flex items-center gap-3 border-b border-border px-4">
              <Search size={16} className="text-faint" />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search agents, calls, pages…"
                className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-faint" />
              <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-faint">ESC</kbd>
            </div>
            <div className="max-h-80 overflow-y-auto scrollbar-thin p-2">
              {filtered.length === 0 && <p className="px-3 py-8 text-center text-sm text-faint">No results for “{q}”</p>}
              {filtered.map((i, idx) => (
                <button key={idx} onClick={() => { router.push(i.href); setOpen(false); setQ(""); }}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-elevated">
                  <span className="text-sm font-500">{i.label}</span>
                  <span className="flex items-center gap-2 text-[11px] text-faint">{i.sub}<CornerDownLeft size={11} /></span>
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
