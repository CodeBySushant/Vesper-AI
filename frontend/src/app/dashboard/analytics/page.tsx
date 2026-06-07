"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { Card, Badge } from "@/components/ui";
import { PageHeader, Stagger, item } from "@/components/page-bits";
import { callVolume, outcomeFunnel, langSplit } from "@/lib/data";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, ResponsiveContainer,
  XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

const PIE = ["rgb(var(--accent))", "rgb(var(--positive))", "rgb(var(--warn))", "rgb(var(--faint))"];
const ranges = ["7 days", "30 days", "90 days"];

export default function AnalyticsPage() {
  const [range, setRange] = useState("7 days");
  const tip = { background: "rgb(var(--surface))", border: "1px solid rgb(var(--border))", borderRadius: 12, fontSize: 12 };
  return (
    <div>
      <PageHeader title="Analytics" sub="Outcomes, conversion and cost across all agents."
        action={<div className="flex gap-1 rounded-xl border border-border bg-surface p-1">
          {ranges.map((r) => <button key={r} onClick={() => setRange(r)} className={`rounded-lg px-3 py-1.5 text-[13px] ${range === r ? "bg-elevated font-500" : "text-muted"}`}>{r}</button>)}
        </div>} />

      <Stagger>
        <motion.div variants={item} className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[["Total calls", "2,170", "+12%"], ["Avg duration", "1m 58s", "−4%"], ["Success rate", "84.2%", "+3pts"], ["Cost / call", "₹6.40", "−8%"]].map(([l, v, d]) => (
            <Card key={l} className="p-4"><p className="text-[12px] text-muted">{l}</p><p className="mt-1.5 font-display text-2xl font-600">{v}</p><Badge tone={d.startsWith("−") && l === "Cost / call" ? "positive" : d.startsWith("−") ? "danger" : "positive"} className="mt-2">{d}</Badge></Card>
          ))}
        </motion.div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <motion.div variants={item}>
            <Card className="p-5">
              <h3 className="text-[15px] font-600">Calls vs. booked</h3>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={callVolume} margin={{ left: -20 }}>
                    <CartesianGrid stroke="rgb(var(--border))" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="d" tick={{ fontSize: 11, fill: "rgb(var(--faint))" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "rgb(var(--faint))" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tip} cursor={{ fill: "rgb(var(--elevated))" }} />
                    <Bar dataKey="calls" fill="rgb(var(--accent))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="booked" fill="rgb(var(--positive))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="p-5">
              <h3 className="text-[15px] font-600">Language distribution</h3>
              <div className="mt-4 flex items-center gap-6">
                <div className="h-48 w-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={langSplit} dataKey="value" innerRadius={48} outerRadius={72} paddingAngle={3} stroke="none">
                        {langSplit.map((_, i) => <Cell key={i} fill={PIE[i]} />)}
                      </Pie>
                      <Tooltip contentStyle={tip} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {langSplit.map((l, i) => (
                    <div key={l.name} className="flex items-center gap-2 text-[13px]"><span className="h-2.5 w-2.5 rounded-full" style={{ background: PIE[i] }} /><span className="text-muted">{l.name}</span><span className="font-500">{l.value}%</span></div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={item} className="mt-4">
          <Card className="p-5">
            <h3 className="text-[15px] font-600">Conversion funnel</h3>
            <div className="mt-5 space-y-2.5">
              {outcomeFunnel.map((s, i) => {
                const pct = (s.value / outcomeFunnel[0].value) * 100;
                return (
                  <div key={s.stage} className="flex items-center gap-4">
                    <span className="w-24 text-[13px] text-muted">{s.stage}</span>
                    <div className="flex-1">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, delay: i * 0.08 }}
                        className="flex h-9 items-center justify-end rounded-lg pr-3 text-[12px] font-500 text-white" style={{ background: `rgb(var(--accent) / ${1 - i * 0.13})` }}>
                        {s.value.toLocaleString()}
                      </motion.div>
                    </div>
                    <span className="w-12 text-right text-[12px] text-faint">{pct.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </motion.div>
      </Stagger>
    </div>
  );
}
