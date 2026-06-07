"use client";
import { motion } from "framer-motion";
import { Card, Badge, Button } from "@/components/ui";
import { PageHeader, Stagger, item } from "@/components/page-bits";
import { team } from "@/lib/data";
import { UserPlus, MoreHorizontal } from "lucide-react";

const roleTone: Record<string, "accent" | "positive" | "warn" | "neutral"> = { Owner: "accent", Admin: "positive", Manager: "warn", Viewer: "neutral" };

export default function TeamPage() {
  return (
    <div>
      <PageHeader title="Team" sub="Invite teammates and manage permissions."
        action={<Button variant="primary" size="sm"><UserPlus size={15} /> Invite member</Button>} />

      <Stagger>
        <motion.div variants={item}>
          <Card className="overflow-hidden">
            <div className="divide-y divide-border">
              {team.map((m) => (
                <div key={m.id} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-full text-[13px] font-600 text-white" style={{ background: m.color }}>{m.initials}</span>
                    <div><p className="text-[14px] font-500">{m.name}</p><p className="text-[12px] text-faint">{m.email}</p></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge tone={roleTone[m.role]}>{m.role}</Badge>
                    <button className="text-faint hover:text-ink"><MoreHorizontal size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item} className="mt-4 grid gap-3 sm:grid-cols-4">
          {[["Owner", "Full access, billing"], ["Admin", "Manage agents & team"], ["Manager", "Run campaigns"], ["Viewer", "Read-only"]].map(([r, d]) => (
            <Card key={r} className="p-4"><Badge tone={roleTone[r]}>{r}</Badge><p className="mt-2 text-[12px] text-muted">{d}</p></Card>
          ))}
        </motion.div>
      </Stagger>
    </div>
  );
}
