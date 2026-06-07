"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, Badge, Button } from "@/components/ui";
import { PageHeader, Stagger, item } from "@/components/page-bits";
import { Copy, Eye, EyeOff, Plus, Check } from "lucide-react";

const keys = [
  { id: "k1", name: "Production", key: "vsk_live_8f3a2b9c4d1e7a6f5b8c", created: "Sep 12, 2026", last: "2 min ago" },
  { id: "k2", name: "Development", key: "vsk_test_2a1b4c6d8e0f3a5b7c9d", created: "Aug 3, 2026", last: "1 day ago" },
];
const webhooks = [
  { url: "https://api.sunaulo.com/hooks/calls", events: "call.completed, call.failed", status: "active" },
  { url: "https://crm.metrohomes.in/vesper", events: "lead.qualified", status: "active" },
];
const logs = [
  { method: "POST", path: "/v1/calls", status: 201, time: "142ms", when: "14:22:08" },
  { method: "GET", path: "/v1/agents", status: 200, time: "38ms", when: "14:21:55" },
  { method: "POST", path: "/v1/campaigns", status: 201, time: "210ms", when: "14:20:03" },
  { method: "GET", path: "/v1/calls/c_1", status: 200, time: "44ms", when: "14:19:47" },
  { method: "POST", path: "/v1/calls", status: 429, time: "12ms", when: "14:18:30" },
];

export default function ApiPage() {
  const [shown, setShown] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (k: string) => { navigator.clipboard?.writeText(k); setCopied(k); setTimeout(() => setCopied(null), 1500); };

  return (
    <div>
      <PageHeader title="API & developers" sub="Integrate Vesper into your own product."
        action={<Button variant="primary" size="sm"><Plus size={15} /> Create key</Button>} />

      <Stagger>
        <motion.div variants={item}>
          <Card className="overflow-hidden">
            <div className="border-b border-border p-5 pb-3"><h3 className="text-[15px] font-600">API keys</h3></div>
            <div className="divide-y divide-border">
              {keys.map((k) => (
                <div key={k.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
                  <div>
                    <p className="text-[14px] font-500">{k.name}</p>
                    <p className="text-[11px] text-faint">Created {k.created} · Last used {k.last}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="rounded-lg bg-elevated px-3 py-1.5 font-mono text-[12px]">{shown === k.id ? k.key : k.key.slice(0, 12) + "••••••••"}</code>
                    <button onClick={() => setShown(shown === k.id ? null : k.id)} className="text-faint hover:text-ink">{shown === k.id ? <EyeOff size={15} /> : <Eye size={15} />}</button>
                    <button onClick={() => copy(k.key)} className="text-faint hover:text-ink">{copied === k.key ? <Check size={15} className="text-positive" /> : <Copy size={15} />}</button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <motion.div variants={item}>
            <Card className="h-full p-5">
              <h3 className="text-[15px] font-600">Webhooks</h3>
              <div className="mt-3 space-y-2">
                {webhooks.map((w) => (
                  <div key={w.url} className="rounded-xl border border-border p-3">
                    <div className="flex items-center justify-between"><code className="truncate font-mono text-[12px]">{w.url}</code><Badge tone="positive">{w.status}</Badge></div>
                    <p className="mt-1 text-[11px] text-faint">{w.events}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" className="mt-3"><Plus size={14} /> Add endpoint</Button>
            </Card>
          </motion.div>

          <motion.div variants={item}>
            <Card className="h-full p-5">
              <h3 className="text-[15px] font-600">Quickstart</h3>
              <pre className="mt-3 overflow-x-auto rounded-xl bg-ink p-4 font-mono text-[12px] leading-relaxed text-bg scrollbar-thin">
{`curl https://api.vesper.ai/v1/calls \\
  -H "Authorization: Bearer vsk_live_…" \\
  -d agent_id="ag_clinic" \\
  -d to="+9779841234567"`}
              </pre>
              <a href="#" className="mt-3 inline-block text-[13px] text-accent hover:underline">Read the full API reference →</a>
            </Card>
          </motion.div>
        </div>

        <motion.div variants={item} className="mt-4">
          <Card className="overflow-hidden">
            <div className="border-b border-border p-5 pb-3"><h3 className="text-[15px] font-600">Request logs</h3></div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border font-mono text-[12px]">
                {logs.map((l, i) => (
                  <tr key={i} className="hover:bg-elevated/60">
                    <td className="px-5 py-3"><Badge tone={l.method === "POST" ? "accent" : "neutral"}>{l.method}</Badge></td>
                    <td className="px-5 py-3">{l.path}</td>
                    <td className="px-5 py-3"><span className={l.status < 300 ? "text-positive" : l.status === 429 ? "text-warn" : "text-danger"}>{l.status}</span></td>
                    <td className="px-5 py-3 text-muted">{l.time}</td>
                    <td className="px-5 py-3 text-right text-faint">{l.when}</td>
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
