"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Card, Badge, Button } from "@/components/ui";
import { PageHeader, Stagger, item } from "@/components/page-bits";
import { kpis, callVolume, activity, agents } from "@/lib/data";
import { ArrowUpRight, Plus, Megaphone, BookOpen, TrendingUp } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip, CartesianGrid } from "recharts";

export default function Overview() {
  return (
    <div>
      <PageHeader title="Good afternoon, Sheetal" sub="Here's what your agents have been up to today."
        action={<Link href="/dashboard/agents/builder"><Button variant="primary" size="sm"><Plus size={15} /> New agent</Button></Link>} />

      <Stagger>
        <motion.div variants={item} className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {kpis.map((k) => (
            <Card key={k.label} hover className="p-4">
              <p className="text-[12px] text-muted">{k.label}</p>
              <p className="mt-1.5 font-display text-[26px] font-600 leading-none">{k.value}</p>
              <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-500 text-positive"><ArrowUpRight size={12} /> {k.delta}</span>
            </Card>
          ))}
        </motion.div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <motion.div variants={item}>
            <Card className="p-5">
              <div className="flex items-center justify-between">
                <div><h3 className="text-[15px] font-600">Call volume</h3><p className="text-[12px] text-muted">Last 7 days</p></div>
                <Badge tone="positive"><TrendingUp size={11} /> +14.2%</Badge>
              </div>
              <div className="mt-4 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={callVolume} margin={{ left: -20, right: 6, top: 6 }}>
                    <defs>
                      <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgb(var(--accent))" stopOpacity={0.28} /><stop offset="100%" stopColor="rgb(var(--accent))" stopOpacity={0} /></linearGradient>
                      <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgb(var(--positive))" stopOpacity={0.22} /><stop offset="100%" stopColor="rgb(var(--positive))" stopOpacity={0} /></linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgb(var(--border))" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="d" tick={{ fontSize: 11, fill: "rgb(var(--faint))" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "rgb(var(--surface))", border: "1px solid rgb(var(--border))", borderRadius: 12, fontSize: 12 }} />
                    <Area type="monotone" dataKey="calls" stroke="rgb(var(--accent))" strokeWidth={2} fill="url(#g1)" />
                    <Area type="monotone" dataKey="booked" stroke="rgb(var(--positive))" strokeWidth={2} fill="url(#g2)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="h-full p-5">
              <h3 className="text-[15px] font-600">Recent activity</h3>
              <div className="mt-4 space-y-3.5">
                {activity.map((a, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${a.kind === "success" ? "bg-positive" : a.kind === "warn" ? "bg-warn" : "bg-faint"}`} />
                    <p className="text-[13px] leading-snug text-muted"><span className="font-500 text-ink">{a.who}</span> {a.what} <span className="block text-[11px] text-faint">{a.when}</span></p>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={item} className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr_1fr]">
          {[
            { icon: Plus, t: "Create an agent", d: "Design a new voice agent", href: "/dashboard/agents/builder" },
            { icon: Megaphone, t: "Launch a campaign", d: "Upload contacts & dial out", href: "/dashboard/campaigns" },
            { icon: BookOpen, t: "Add knowledge", d: "Upload docs for your agents", href: "/dashboard/knowledge" },
          ].map((q) => (
            <Link key={q.t} href={q.href}>
              <Card hover className="flex items-center gap-4 p-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent-soft text-accent"><q.icon size={18} /></span>
                <div><p className="text-[14px] font-600">{q.t}</p><p className="text-[12px] text-muted">{q.d}</p></div>
              </Card>
            </Link>
          ))}
        </motion.div>

        <motion.div variants={item} className="mt-4">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between p-5 pb-3">
              <h3 className="text-[15px] font-600">Your agents</h3>
              <Link href="/dashboard/agents" className="text-[13px] text-accent hover:underline">View all</Link>
            </div>
            <div className="divide-y divide-border">
              {agents.slice(0, 3).map((a) => (
                <div key={a.id} className="flex items-center justify-between px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-elevated text-[13px] font-600">{a.name[0]}</span>
                    <div><p className="text-[14px] font-500">{a.name}</p><p className="text-[12px] text-faint">{a.voice} · {a.language}</p></div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="hidden text-[13px] text-muted sm:block">{a.calls.toLocaleString()} calls</span>
                    <span className="hidden text-[13px] text-muted sm:block">{a.successRate}% success</span>
                    <Badge tone={a.status === "live" ? "positive" : a.status === "paused" ? "warn" : "neutral"}>
                      <span className={`h-1.5 w-1.5 rounded-full ${a.status === "live" ? "bg-positive" : a.status === "paused" ? "bg-warn" : "bg-faint"}`} />{a.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </Stagger>
    </div>
  );
}
