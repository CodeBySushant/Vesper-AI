"use client";
import { motion } from "framer-motion";
import { Card, Badge, Button } from "@/components/ui";
import { PageHeader, Stagger, item } from "@/components/page-bits";
import { phoneNumbers } from "@/lib/data";
import { Plus, Hash, PhoneIncoming, PhoneOutgoing } from "lucide-react";

export default function NumbersPage() {
  return (
    <div>
      <PageHeader title="Phone numbers" sub="Connect numbers from Exotel, Plivo, Twilio or a local SIP trunk."
        action={<Button variant="primary" size="sm"><Plus size={15} /> Add number</Button>} />
      <Stagger>
        <div className="grid gap-3 sm:grid-cols-2">
          {phoneNumbers.map((p) => (
            <motion.div key={p.id} variants={item}>
              <Card hover className="flex items-center justify-between p-5">
                <div className="flex items-center gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-accent-soft text-accent">
                    {p.type === "Inbound" ? <PhoneIncoming size={18} /> : <PhoneOutgoing size={18} />}
                  </span>
                  <div>
                    <p className="font-mono text-[15px] font-500">{p.number}</p>
                    <p className="text-[12px] text-faint">{p.provider} · {p.agent}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <Badge tone="positive">{p.status}</Badge>
                  <span className="text-[11px] text-faint">{p.type}</span>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Stagger>
    </div>
  );
}
