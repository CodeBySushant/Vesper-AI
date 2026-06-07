"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, Badge, Button } from "@/components/ui";
import { PageHeader, Stagger, item } from "@/components/page-bits";
import { agents } from "@/lib/data";
import { Plus, MoreHorizontal, Phone, Clock, Target } from "lucide-react";

export default function AgentsPage() {
  return (
    <div>
      <PageHeader title="Agents" sub={`${agents.length} agents · ${agents.filter(a => a.status === "live").length} live`}
        action={<Link href="/dashboard/agents/builder"><Button variant="primary" size="sm"><Plus size={15} /> New agent</Button></Link>} />
      <Stagger>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((a) => (
            <motion.div key={a.id} variants={item}>
              <Card hover className="group flex h-full flex-col p-5">
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft font-display text-lg font-600 text-accent">{a.name[0]}</span>
                  <button className="text-faint opacity-0 transition-opacity group-hover:opacity-100"><MoreHorizontal size={18} /></button>
                </div>
                <h3 className="mt-4 text-[15px] font-600 leading-tight">{a.name}</h3>
                <p className="mt-1 text-[13px] leading-snug text-muted">{a.description}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Badge>{a.voice}</Badge><Badge>{a.language}</Badge>
                </div>
                <div className="mt-auto flex items-center justify-between border-t border-border pt-4 mt-4">
                  <div className="flex gap-4 text-[12px] text-muted">
                    <span className="flex items-center gap-1"><Phone size={12} /> {a.calls.toLocaleString()}</span>
                    <span className="flex items-center gap-1"><Target size={12} /> {a.successRate}%</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {a.avgDuration}</span>
                  </div>
                  <Badge tone={a.status === "live" ? "positive" : a.status === "paused" ? "warn" : "neutral"}>{a.status}</Badge>
                </div>
                <Link href="/dashboard/agents/builder" className="mt-4"><Button variant="outline" size="sm" className="w-full">Open builder</Button></Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </Stagger>
    </div>
  );
}
