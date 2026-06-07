"use client";
import { motion } from "framer-motion";
import { Card, Badge, Button } from "@/components/ui";
import { PageHeader, Stagger, item } from "@/components/page-bits";
import { invoices } from "@/lib/data";
import { CreditCard, Download, Check } from "lucide-react";

export default function BillingPage() {
  const usage = [["AI minutes", 1910, 3000], ["Agents", 4, 5], ["Phone numbers", 4, 10]] as const;
  return (
    <div>
      <PageHeader title="Billing" sub="Manage your plan, usage and invoices." />

      <Stagger>
        <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
          <motion.div variants={item}>
            <Card className="p-5">
              <div className="flex items-start justify-between">
                <div><Badge tone="accent">Current plan</Badge><h3 className="mt-2 font-display text-2xl font-600">Growth</h3><p className="text-[13px] text-muted">₹8,999 / month · renews Nov 1</p></div>
                <Button variant="outline" size="sm">Change plan</Button>
              </div>
              <div className="mt-6 space-y-4">
                {usage.map(([label, used, max]) => (
                  <div key={label}>
                    <div className="flex justify-between text-[13px]"><span className="text-muted">{label}</span><span className="font-500">{used.toLocaleString()} / {max.toLocaleString()}</span></div>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-border">
                      <motion.div initial={{ width: 0 }} animate={{ width: `${(used / max) * 100}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-accent" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="p-5">
              <h3 className="text-[15px] font-600">Payment method</h3>
              <div className="mt-4 flex items-center gap-3 rounded-xl border border-border bg-elevated p-3">
                <span className="grid h-9 w-12 place-items-center rounded-lg bg-ink text-bg"><CreditCard size={16} /></span>
                <div><p className="text-[13px] font-500">•••• 4242</p><p className="text-[11px] text-faint">Expires 09/28</p></div>
              </div>
              <Button variant="outline" size="sm" className="mt-3 w-full">Update card</Button>
              <div className="mt-4 flex items-start gap-2 rounded-xl bg-positive/10 p-3 text-[12px] text-positive"><Check size={14} className="mt-0.5" /> Payments secured by Stripe</div>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={item} className="mt-4">
          <Card className="overflow-hidden">
            <div className="border-b border-border p-5 pb-3"><h3 className="text-[15px] font-600">Invoices</h3></div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-elevated/60">
                    <td className="px-5 py-3.5 font-mono text-[13px]">{inv.number}</td>
                    <td className="px-5 py-3.5 text-muted">{inv.date}</td>
                    <td className="px-5 py-3.5 font-500">{inv.amount}</td>
                    <td className="px-5 py-3.5"><Badge tone="positive">{inv.status}</Badge></td>
                    <td className="px-5 py-3.5 text-right"><button className="text-faint hover:text-accent"><Download size={16} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </motion.div>
      </Stagger>
    </div>
  );
}
