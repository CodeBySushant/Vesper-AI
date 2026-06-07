"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Badge, Button } from "@/components/ui";
import { PageHeader } from "@/components/page-bits";
import { calls, transcript, type Call } from "@/lib/data";
import { Search, Play, Pause, X, Download, PhoneCall } from "lucide-react";

const outcomeTone: Record<string, "positive" | "warn" | "danger" | "neutral" | "accent"> = {
  Booked: "positive", Qualified: "positive", Resolved: "positive",
  Escalated: "warn", "No answer": "neutral", Declined: "danger",
};

export default function CallsPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("All");
  const [selected, setSelected] = useState<Call | null>(null);
  const [playing, setPlaying] = useState(false);

  const filters = ["All", "Booked", "Qualified", "Escalated", "No answer"];
  const rows = calls.filter((c) =>
    (filter === "All" || c.outcome === filter) &&
    (c.caller.includes(q) || c.agent.toLowerCase().includes(q.toLowerCase()))
  );

  return (
    <div>
      <PageHeader title="Calls" sub="Every conversation, transcribed and scored."
        action={<Button variant="outline" size="sm"><Download size={14} /> Export</Button>} />

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-border p-3">
          <div className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-surface px-3 min-w-[200px]">
            <Search size={15} className="text-faint" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search caller or agent…" className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-faint" />
          </div>
          <div className="flex gap-1.5">
            {filters.map((f) => (
              <button key={f} onClick={() => setFilter(f)} className={`rounded-lg px-3 py-1.5 text-[13px] transition-colors ${filter === f ? "bg-elevated font-500 text-ink" : "text-muted hover:text-ink"}`}>{f}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border text-left text-[12px] text-faint">
              {["Caller", "Agent", "Duration", "Sentiment", "Outcome", "Date"].map((h) => <th key={h} className="px-4 py-3 font-500">{h}</th>)}
            </tr></thead>
            <tbody>
              {rows.map((c) => (
                <tr key={c.id} onClick={() => setSelected(c)} className="cursor-pointer border-b border-border transition-colors last:border-0 hover:bg-elevated/60">
                  <td className="px-4 py-3 font-mono text-[13px]">{c.caller}</td>
                  <td className="px-4 py-3 text-muted">{c.agent}</td>
                  <td className="px-4 py-3 text-muted">{c.duration}</td>
                  <td className="px-4 py-3"><span className={`h-2 w-2 inline-block rounded-full ${c.sentiment === "positive" ? "bg-positive" : c.sentiment === "negative" ? "bg-danger" : "bg-faint"}`} /></td>
                  <td className="px-4 py-3"><Badge tone={outcomeTone[c.outcome]}>{c.outcome}</Badge></td>
                  <td className="px-4 py-3 text-faint">{c.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 && <p className="py-12 text-center text-sm text-faint">No calls match your filters.</p>}
        </div>
      </Card>

      {/* Detail drawer */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-sm" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 30, stiffness: 280 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-border bg-surface">
              <div className="flex items-center justify-between border-b border-border px-5 py-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-accent-soft text-accent"><PhoneCall size={15} /></span>
                  <div><p className="font-mono text-[13px]">{selected.caller}</p><p className="text-[12px] text-faint">{selected.agent} · {selected.date}</p></div>
                </div>
                <button onClick={() => setSelected(null)} className="text-faint hover:text-ink"><X size={18} /></button>
              </div>

              <div className="border-b border-border p-5">
                <div className="flex items-center gap-3 rounded-xl border border-border bg-elevated p-3">
                  <button onClick={() => setPlaying((p) => !p)} className="grid h-10 w-10 place-items-center rounded-full bg-accent text-white">{playing ? <Pause size={16} /> : <Play size={16} />}</button>
                  <div className="flex-1">
                    <div className="h-1.5 w-full rounded-full bg-border"><motion.div animate={{ width: playing ? "100%" : "30%" }} transition={{ duration: playing ? 8 : 0.3 }} className="h-full rounded-full bg-accent" /></div>
                    <p className="mt-1.5 text-[11px] text-faint">{selected.duration}</p>
                  </div>
                  <Download size={16} className="text-faint" />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  {[["Outcome", selected.outcome], ["Sentiment", selected.sentiment], ["Duration", selected.duration]].map(([l, v]) => (
                    <div key={l} className="rounded-xl bg-elevated p-2"><p className="text-[10px] text-faint">{l}</p><p className="mt-0.5 text-[12px] font-500 capitalize">{v}</p></div>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
                <p className="mb-3 text-[12px] font-600 uppercase tracking-wide text-faint">Transcript</p>
                <div className="space-y-3">
                  {transcript.map((m, i) => (
                    <div key={i} className="flex gap-3">
                      <span className="mt-0.5 w-9 shrink-0 font-mono text-[11px] text-faint">{m.t}</span>
                      <div>
                        <p className={`text-[11px] font-600 ${m.who === "agent" ? "text-accent" : "text-muted"}`}>{m.who === "agent" ? "Aastha" : "Caller"}</p>
                        <p className="text-[13px] leading-snug text-ink">{m.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
