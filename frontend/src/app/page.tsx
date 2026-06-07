"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { MarketingNav } from "@/components/marketing-nav";
import { CallCard } from "@/components/call-card";
import { AnimatedBackground } from "@/components/animated-background";
import { AgentOrb } from "@/components/agent-orb";
import { Button, MagneticButton, Card, Badge, Logo } from "@/components/ui";
import { reveal, revealContainer, revealUp } from "@/lib/motion";
import { pricing, faqs, logos, BRAND } from "@/lib/data";
import {
  ArrowRight, Check, Minus, Plus, MessageSquare, BarChart3, Workflow,
  BookOpen, Plug, Languages, Stethoscope, Phone, CalendarCheck, Headphones,
  Banknote, Users, TrendingUp, Sparkles,
} from "lucide-react";

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

export default function Landing() {
  return (
    <main className="relative">
      <MarketingNav />

      {/* HERO */}
      <section className="relative overflow-hidden px-5 pt-40 pb-28">
        <AnimatedBackground variant="hero" />
        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2.5 text-[13px]">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-accent" /></span>
              <Counter target={1284907} /> <span className="uppercase tracking-[0.16em] text-faint">calls handled to date</span>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 font-display text-[clamp(3rem,7.5vw,6rem)] font-500 leading-[0.98] tracking-[-0.03em] text-balance">
              Voice agents<br />that <span className="italic text-accent">sound human.</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
              className="mt-7 max-w-md text-[18px] leading-relaxed text-muted">
              {BRAND.name} builds AI phone agents that book appointments, qualify leads and answer customers — in Nepali, Hindi and English. No robotic voices. No awkward pauses.
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/dashboard"><MagneticButton variant="primary">Build your agent <ArrowRight size={16} /></MagneticButton></Link>
              <a href="#demo"><MagneticButton variant="outline">Hear a live call</MagneticButton></a>
            </motion.div>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.4 }}
              className="mt-6 text-[13px] text-faint">14-day free trial · No credit card · Live in under a day</motion.p>
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center justify-center">
            <AgentOrb />
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="mt-2 text-center">
              <p className="text-[11px] uppercase tracking-[0.2em] text-faint">Talk to an agent</p>
              <p className="mt-1.5 font-display text-2xl font-500">Ask anything</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* TRUSTED BY */}
      <section className="border-y border-border bg-surface/40 px-5 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-[12px] font-500 uppercase tracking-[0.18em] text-faint">Trusted by teams across South Asia</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {logos.map((l) => (
              <span key={l} className="font-display text-lg font-500 text-faint/80 transition-colors hover:text-muted">{l}</span>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT SHOWCASE */}
      <section id="product" className="relative px-5 py-32">
        <AnimatedBackground variant="subtle" />
        <div className="mx-auto max-w-6xl">
          <SectionHead eyebrow="The platform" title="Everything you need to run voice at scale" sub="Design the agent, launch a campaign, watch the calls roll in — all from one calm, fast workspace." />
          <motion.div {...reveal} className="mt-16 overflow-hidden rounded-2xl border border-border bg-surface shadow-lift">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-danger/60" /><span className="h-3 w-3 rounded-full bg-warn/60" /><span className="h-3 w-3 rounded-full bg-positive/60" />
              <span className="ml-3 font-mono text-[11px] text-faint">app.vesper.ai/dashboard</span>
            </div>
            <DashboardPreview />
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHead eyebrow="Features" title="Built for conversations that convert" />
          <motion.div {...revealContainer} className="mt-16 grid gap-4 md:grid-cols-3">
            {[
              { icon: MessageSquare, t: "Human-like conversations", d: "Premium neural voices with natural turn-taking and interruption handling." },
              { icon: BarChart3, t: "Real-time analytics", d: "Live call outcomes, sentiment, conversion funnels and cost tracking." },
              { icon: Workflow, t: "Custom workflows", d: "Branching logic, fallbacks and escalation rules — no code required." },
              { icon: BookOpen, t: "Knowledge base", d: "Upload PDFs, docs and CSVs. Your agent answers from your content." },
              { icon: Plug, t: "Integrations", d: "Connect Exotel, Plivo, Twilio, WhatsApp and your CRM in clicks." },
              { icon: Languages, t: "Multi-language", d: "Nepali, Hindi, Hinglish and English with seamless code-switching." },
            ].map((f) => (
              <motion.div key={f.t} variants={revealUp}>
                <Card hover className="group relative h-full overflow-hidden p-7">
                  <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-accent/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-accent transition-transform duration-300 group-hover:scale-110"><f.icon size={19} /></span>
                  <h3 className="mt-5 text-[16px] font-600">{f.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{f.d}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* USE CASES */}
      <section id="usecases" className="px-5 py-32">
        <div className="mx-auto max-w-6xl">
          <SectionHead eyebrow="Use cases" title="One platform, every calling job" />
          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Stethoscope, t: "Healthcare", d: "Appointment reminders, no-show recovery, follow-ups." },
              { icon: TrendingUp, t: "Lead qualification", d: "Score and route inbound enquiries instantly." },
              { icon: CalendarCheck, t: "Appointment booking", d: "Book directly into your calendar, mid-call." },
              { icon: Headphones, t: "Customer support", d: "First-line triage with graceful human handoff." },
              { icon: Banknote, t: "Collections", d: "Polite, compliant payment reminders at scale." },
              { icon: Phone, t: "Sales outreach", d: "Warm up and qualify leads before your team calls." },
              { icon: Users, t: "Recruitment", d: "Screen candidates with consistent questions." },
              { icon: Sparkles, t: "Feedback & NPS", d: "Collect post-service feedback automatically." },
            ].map((u, i) => (
              <motion.div key={u.t} {...fade} transition={{ ...fade.transition, delay: (i % 4) * 0.05 }}>
                <Card hover className="h-full p-6">
                  <u.icon size={20} className="text-accent" />
                  <h3 className="mt-4 text-[15px] font-600">{u.t}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{u.d}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE DEMO */}
      <section id="demo" className="relative overflow-hidden border-y border-border bg-surface/40 px-5 py-32">
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2">
          <motion.div {...reveal}>
            <Badge tone="accent" className="mb-5"><Phone size={12} /> Live demo</Badge>
            <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.4rem)] font-500 leading-[1.04] tracking-tight">See a real call<br />unfold in real time.</h2>
            <p className="mt-5 max-w-md text-[16px] leading-relaxed text-muted">
              This is Aastha handling a clinic rescheduling — listening, understanding intent, offering open slots, and confirming. Watch the transcript build live, with sentiment and outcome captured automatically.
            </p>
            <ul className="mt-7 space-y-3">
              {["Detects intent and switches language naturally", "Books the new slot without a human", "Logs outcome, sentiment and a full transcript"].map((x) => (
                <li key={x} className="flex items-start gap-3 text-sm text-muted"><Check size={16} className="mt-0.5 shrink-0 text-positive" /> {x}</li>
              ))}
            </ul>
          </motion.div>
          <motion.div {...reveal} className="flex justify-center"><CallCard /></motion.div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-5 py-32">
        <div className="mx-auto max-w-6xl">
          <SectionHead eyebrow="Pricing" title="Simple plans that scale with you" sub="Start free. Upgrade when calls turn into revenue. Prices in INR — talk to us for NPR." />
          <motion.div {...revealContainer} className="mt-16 grid gap-6 lg:grid-cols-3">
            {pricing.map((p) => (
              <motion.div key={p.name} variants={revealUp}>
                <Card className={`relative h-full p-7 transition-all duration-300 hover:-translate-y-1 ${p.highlight ? "ring-2 ring-accent shadow-glow" : "hover:shadow-lift"}`}>
                  {p.highlight && <Badge tone="accent" className="absolute -top-3 left-7">Most popular</Badge>}
                  <h3 className="font-display text-xl font-600">{p.name}</h3>
                  <p className="mt-1 text-[13px] text-muted">{p.tagline}</p>
                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="font-display text-[2.75rem] font-600 leading-none">{p.price}</span>
                    <span className="text-sm text-faint">{p.period}</span>
                  </div>
                  <Link href="/dashboard" className="mt-6 block">
                    <Button variant={p.highlight ? "secondary" : "outline"} className="w-full">{p.cta}</Button>
                  </Link>
                  <ul className="mt-7 space-y-3">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-[13px] text-muted"><Check size={15} className="mt-0.5 shrink-0 text-accent" /> {f}</li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-5 py-20">
        <div className="mx-auto max-w-3xl">
          <SectionHead eyebrow="FAQ" title="Questions, answered" />
          <div className="mt-12 divide-y divide-border rounded-2xl border border-border bg-surface">
            {faqs.map((f, i) => <FaqRow key={i} {...f} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-24">
        <motion.div {...reveal} className="relative mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-border bg-ink px-8 py-20 text-center text-bg">
          <motion.div className="pointer-events-none absolute left-1/2 top-0 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/3 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, rgb(var(--accent) / 0.5), transparent 70%)" }}
            animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.1, 1] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
          <div className="relative">
            <h2 className="font-display text-[clamp(2.2rem,4.5vw,3.6rem)] font-500 leading-[1.05] tracking-tight">Give your phone line<br />a human voice.</h2>
            <p className="mx-auto mt-5 max-w-md text-[15px] text-bg/70">Build your first agent in minutes. Hear the difference instantly.</p>
            <Link href="/dashboard" className="mt-9 inline-block">
              <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} transition={{ type: "spring", stiffness: 400, damping: 22 }}
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-bg px-7 text-[15px] font-500 text-ink shadow-lift">
                Start free trial <ArrowRight size={16} />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border px-5 py-14">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-muted">{BRAND.tagline} Built for Nepal and India.</p>
          </div>
          {[
            ["Product", ["Agents", "Campaigns", "Analytics", "Pricing"]],
            ["Company", ["About", "Careers", "Blog", "Contact"]],
            ["Legal", ["Privacy", "Terms", "DPDPA", "TRAI compliance"]],
          ].map(([title, items]) => (
            <div key={title as string}>
              <p className="text-[13px] font-600">{title as string}</p>
              <ul className="mt-3 space-y-2">
                {(items as string[]).map((it) => <li key={it}><a href="#" className="text-[13px] text-muted hover:text-ink">{it}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-border pt-6 text-[12px] text-faint sm:flex-row">
          <p>© 2026 Vesper Voice. A demo product.</p>
          <p>Made in Kathmandu & Noida</p>
        </div>
      </footer>
    </main>
  );
}

function SectionHead({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <motion.div {...reveal} className="mx-auto max-w-2xl text-center">
      <p className="text-[12px] font-600 uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      <h2 className="mt-4 font-display text-[clamp(2rem,3.8vw,3rem)] font-500 leading-[1.06] tracking-[-0.02em] text-balance">{title}</h2>
      {sub && <p className="mx-auto mt-5 max-w-lg text-[16px] leading-relaxed text-muted">{sub}</p>}
    </motion.div>
  );
}

function Counter({ target }: { target: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const dur = 1800, start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return <span className="font-500 tabular-nums text-ink">{n.toLocaleString()}</span>;
}

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <button onClick={() => setOpen((o) => !o)} className="flex w-full flex-col px-5 py-4 text-left">
      <span className="flex items-center justify-between gap-4">
        <span className="text-[15px] font-500">{q}</span>
        <span className="shrink-0 text-muted">{open ? <Minus size={16} /> : <Plus size={16} />}</span>
      </span>
      <motion.span initial={false} animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }} className="overflow-hidden">
        <span className="mt-2.5 block text-[14px] leading-relaxed text-muted">{a}</span>
      </motion.span>
    </button>
  );
}

function DashboardPreview() {
  return (
    <div className="grid grid-cols-[180px_1fr] bg-bg text-[12px]">
      <div className="hidden flex-col gap-1 border-r border-border p-3 sm:flex">
        {["Overview", "Agents", "Calls", "Campaigns", "Analytics"].map((x, i) => (
          <span key={x} className={`rounded-lg px-3 py-2 ${i === 0 ? "bg-elevated font-500 text-ink" : "text-muted"}`}>{x}</span>
        ))}
      </div>
      <div className="p-5">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[["Calls today", "1,284"], ["Minutes", "3,910"], ["Conversion", "21.9%"], ["Revenue", "₹4.2L"]].map(([l, v]) => (
            <div key={l} className="rounded-xl border border-border bg-surface p-3">
              <p className="text-[11px] text-faint">{l}</p><p className="mt-1 font-display text-lg font-600">{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex h-28 items-end gap-1.5 rounded-xl border border-border bg-surface p-4">
          {[40, 62, 54, 78, 88, 70, 38].map((h, i) => (
            <div key={i} className="flex-1 rounded-t bg-accent/80" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
