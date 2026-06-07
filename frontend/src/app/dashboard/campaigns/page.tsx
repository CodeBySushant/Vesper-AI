"use client";
import { motion } from "framer-motion";
import { Card, Badge, Button } from "@/components/ui";
import { PageHeader, Stagger, item } from "@/components/page-bits";
import { campaigns } from "@/lib/data";
import { Plus, Upload, Play, Pause, Calendar, CheckCircle2 } from "lucide-react";

const statusMap = {
  running: { tone: "positive" as const, icon: Play },
  scheduled: { tone: "accent" as const, icon: Calendar },
  completed: { tone: "neutral" as const, icon: CheckCircle2 },
  paused: { tone: "warn" as const, icon: Pause },
};

export default function CampaignsPage() {
  return (
    <div>
      <PageHeader title="Campaigns" sub="Outbound calling at scale."
        action={<div className="flex gap-2"><Button variant="outline" size="sm"><Upload size={14} /> Import CSV</Button><Button variant="primary" size="sm"><Plus size={15} /> New campaign</Button></div>} />

      <Stagger>
        <div className="grid gap-4">
          {campaigns.map((c) => {
            const s = statusMap[c.status];
            return (
              <motion.div key={c.id} variants={item}>
                <Card hover className="p-5">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-accent"><s.icon size={18} /></span>
                      <div>
                        <p className="text-[15px] font-600">{c.name}</p>
                        <p className="text-[12px] text-faint">Agent: {c.agent} · Created {c.created}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right"><p className="font-display text-lg font-600">{c.reached.toLocaleString()}</p><p className="text-[11px] text-faint">/ {c.contacts.toLocaleString()} reached</p></div>
                      <Badge tone={s.tone}>{c.status}</Badge>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-[11px] text-faint"><span>Progress</span><span>{c.progress}%</span></div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-border">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${c.progress}%` }} transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full rounded-full ${c.status === "completed" ? "bg-positive" : "bg-accent"}`} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </Stagger>
    </div>
  );
}
