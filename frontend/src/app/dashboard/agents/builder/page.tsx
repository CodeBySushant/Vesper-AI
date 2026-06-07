"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Badge, Card } from "@/components/ui";
import {
  ChevronLeft, User, Mic, FileText, BookOpen, Shield, Clock,
  Play, Send, Sparkles, Plus, Check, Volume2, Gauge,
} from "lucide-react";
import { documents } from "@/lib/data";

const sections = [
  { id: "identity", label: "Identity", icon: User },
  { id: "voice", label: "Voice", icon: Mic },
  { id: "prompt", label: "Prompt", icon: FileText },
  { id: "knowledge", label: "Knowledge", icon: BookOpen },
  { id: "behavior", label: "Behavior", icon: Shield },
  { id: "hours", label: "Hours", icon: Clock },
];

const voices = ["Maya (warm)", "Arjun (confident)", "Priya (calm)", "Neha (friendly)", "Kabir (deep)"];
const langs = ["Nepali · English", "Hindi · English", "Hinglish", "English", "Hindi"];

export default function AgentBuilder() {
  const [active, setActive] = useState("identity");
  const [name, setName] = useState("Aastha — Clinic Receptionist");
  const [voice, setVoice] = useState(voices[0]);
  const [lang, setLang] = useState(langs[0]);
  const [speed, setSpeed] = useState(1);
  const [prompt, setPrompt] = useState(
    "You are Aastha, a warm and efficient receptionist for Sunaulo Clinic.\n\nGoals:\n- Confirm or reschedule appointments politely\n- Always greet in Nepali, then match the caller's language\n- Offer two open slots when rescheduling\n- Confirm details before ending the call\n\nNever give medical advice. If asked, offer to connect a human."
  );
  const [chat, setChat] = useState<{ who: "agent" | "caller"; text: string }[]>([
    { who: "agent", text: "Namaste! Sunaulo Clinic bata Aastha bolde chu. How may I help you today?" },
  ]);
  const [input, setInput] = useState("");

  function send() {
    if (!input.trim()) return;
    const userText = input;
    setChat((c) => [...c, { who: "caller", text: userText }]);
    setInput("");
    setTimeout(() => {
      const replies = [
        "Of course — I can help with that. May I have your name and preferred date?",
        "I have 3:30 PM or 4:15 PM open tomorrow. Which works better for you?",
        "Perfect, you're confirmed. I'll send a reminder shortly. Anything else?",
      ];
      setChat((c) => [...c, { who: "agent", text: replies[Math.min(c.filter(m => m.who === "caller").length, replies.length - 1)] }]);
    }, 600);
  }

  return (
    <div className="-mx-5 -my-7 flex h-[calc(100vh-4rem)] flex-col">
      {/* Builder header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/agents"><Button variant="ghost" size="sm"><ChevronLeft size={16} /> Agents</Button></Link>
          <span className="text-border">/</span>
          <span className="text-sm font-500">{name}</span>
          <Badge tone="warn">Draft</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Play size={14} /> Test call</Button>
          <Button variant="secondary" size="sm"><Check size={14} /> Publish</Button>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 overflow-hidden lg:grid-cols-[200px_1fr_360px]">
        {/* LEFT — section nav */}
        <div className="hidden flex-col gap-1 border-r border-border p-3 lg:flex">
          {sections.map((s) => (
            <button key={s.id} onClick={() => setActive(s.id)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${active === s.id ? "bg-elevated font-500 text-ink" : "text-muted hover:text-ink"}`}>
              <s.icon size={16} className={active === s.id ? "text-accent" : ""} /> {s.label}
            </button>
          ))}
        </div>

        {/* CENTER — editor */}
        <div className="overflow-y-auto scrollbar-thin p-6">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="mx-auto max-w-xl">
              {active === "identity" && (
                <Field title="Identity" desc="How your agent introduces itself.">
                  <Label>Agent name</Label>
                  <input value={name} onChange={(e) => setName(e.target.value)} className="input" />
                  <Label className="mt-4">Description</Label>
                  <textarea defaultValue="Appointment reminders & rescheduling for clinics" className="input h-20 resize-none" />
                </Field>
              )}
              {active === "voice" && (
                <Field title="Voice & language" desc="Pick a voice and how it speaks.">
                  <Label>Voice</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {voices.map((v) => (
                      <button key={v} onClick={() => setVoice(v)} className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-[13px] transition-colors ${voice === v ? "border-accent bg-accent-soft text-ink" : "border-border text-muted hover:bg-elevated"}`}>
                        {v} <Volume2 size={14} className={voice === v ? "text-accent" : "text-faint"} />
                      </button>
                    ))}
                  </div>
                  <Label className="mt-4">Language</Label>
                  <div className="flex flex-wrap gap-2">
                    {langs.map((l) => (
                      <button key={l} onClick={() => setLang(l)} className={`rounded-full border px-3 py-1.5 text-[13px] transition-colors ${lang === l ? "border-accent bg-accent-soft text-ink" : "border-border text-muted hover:bg-elevated"}`}>{l}</button>
                    ))}
                  </div>
                  <Label className="mt-5 flex items-center gap-2"><Gauge size={13} /> Speaking speed · {speed.toFixed(1)}x</Label>
                  <input type="range" min={0.5} max={1.5} step={0.1} value={speed} onChange={(e) => setSpeed(+e.target.value)} className="w-full accent-accent" />
                </Field>
              )}
              {active === "prompt" && (
                <Field title="Prompt" desc="The instructions that shape every conversation.">
                  <div className="mb-2 flex justify-end"><Button variant="ghost" size="sm"><Sparkles size={13} className="text-accent" /> Improve with AI</Button></div>
                  <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="input h-80 resize-none font-mono text-[13px] leading-relaxed" />
                </Field>
              )}
              {active === "knowledge" && (
                <Field title="Knowledge sources" desc="Documents your agent can reference.">
                  {documents.map((d) => (
                    <label key={d.id} className="flex items-center gap-3 rounded-xl border border-border px-3 py-2.5">
                      <input type="checkbox" defaultChecked={d.status === "indexed"} className="accent-accent" />
                      <FileText size={15} className="text-faint" />
                      <span className="flex-1 text-[13px]">{d.name}</span>
                      <Badge tone={d.status === "indexed" ? "positive" : "warn"}>{d.status}</Badge>
                    </label>
                  ))}
                  <Button variant="outline" size="sm" className="mt-1"><Plus size={14} /> Attach document</Button>
                </Field>
              )}
              {active === "behavior" && (
                <Field title="Behavior rules" desc="Fallbacks and escalation logic.">
                  {["If the caller asks for medical advice, decline and offer a human.", "After 2 failed understandings, escalate to a human teammate.", "If the caller is angry, switch to a calm tone and offer callback."].map((r, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl border border-border px-3 py-2.5 text-[13px] text-muted">
                      <Shield size={14} className="mt-0.5 text-accent" /> {r}
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="mt-1"><Plus size={14} /> Add rule</Button>
                </Field>
              )}
              {active === "hours" && (
                <Field title="Business hours" desc="When this agent is allowed to call (TRAI: 9am–9pm).">
                  {["Monday – Friday", "Saturday", "Sunday"].map((d, i) => (
                    <div key={d} className="flex items-center justify-between rounded-xl border border-border px-3 py-2.5 text-[13px]">
                      <span>{d}</span>
                      <span className="text-muted">{i === 2 ? "Closed" : "9:00 AM – 6:00 PM"}</span>
                    </div>
                  ))}
                </Field>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* RIGHT — live preview */}
        <div className="flex flex-col border-t border-border lg:border-l lg:border-t-0">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <span className="flex items-center gap-2 text-[13px] font-600"><span className="h-1.5 w-1.5 rounded-full bg-positive animate-pulse" /> Live preview</span>
            <span className="text-[11px] text-faint">{voice}</span>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto scrollbar-thin p-4">
            {chat.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.who === "agent" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-[13px] leading-snug ${m.who === "agent" ? "rounded-tl-md bg-elevated" : "rounded-tr-md bg-accent text-white"}`}>{m.text}</div>
              </motion.div>
            ))}
          </div>
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-1.5">
              <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type as the caller…" className="h-8 w-full bg-transparent text-[13px] outline-none placeholder:text-faint" />
              <button onClick={send} className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-white"><Send size={14} /></button>
            </div>
            <p className="mt-2 text-center text-[11px] text-faint">Simulated — no real call is placed</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .input { width: 100%; border-radius: 12px; border: 1px solid rgb(var(--border)); background: rgb(var(--surface)); padding: 10px 12px; font-size: 14px; outline: none; }
        .input:focus { border-color: rgb(var(--accent)); box-shadow: 0 0 0 3px rgb(var(--accent) / 0.12); }
      `}</style>
    </div>
  );
}

function Field({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-xl font-600">{title}</h2>
      <p className="mt-1 text-[13px] text-muted">{desc}</p>
      <div className="mt-5 space-y-2">{children}</div>
    </div>
  );
}
function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-[12px] font-500 text-muted ${className}`}>{children}</p>;
}
