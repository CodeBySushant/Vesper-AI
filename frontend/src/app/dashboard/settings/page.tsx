"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, Button, Badge } from "@/components/ui";
import { PageHeader } from "@/components/page-bits";
import { Building2, Palette, Bell, ShieldCheck } from "lucide-react";

const tabs = [
  { id: "org", label: "Organization", icon: Building2 },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: ShieldCheck },
];

export default function SettingsPage() {
  const [tab, setTab] = useState("org");
  return (
    <div>
      <PageHeader title="Settings" sub="Manage your organization and preferences." />
      <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
        <div className="flex gap-1 overflow-x-auto lg:flex-col">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${tab === t.id ? "bg-elevated font-500 text-ink" : "text-muted hover:text-ink"}`}>
              <t.icon size={16} className={tab === t.id ? "text-accent" : ""} /> {t.label}
            </button>
          ))}
        </div>

        <Card className="p-6">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className="max-w-lg space-y-5">
              {tab === "org" && (<>
                <Row label="Organization name"><input defaultValue="Vesper Voice" className="inp" /></Row>
                <Row label="Workspace URL"><div className="flex"><span className="grid place-items-center rounded-l-xl border border-r-0 border-border bg-elevated px-3 text-[13px] text-faint">vesper.ai/</span><input defaultValue="sunaulo" className="inp rounded-l-none" /></div></Row>
                <Row label="Default timezone"><input defaultValue="Asia/Kathmandu (NPT)" className="inp" /></Row>
                <Button variant="primary" size="sm">Save changes</Button>
              </>)}
              {tab === "branding" && (<>
                <Row label="Brand color"><div className="flex gap-2">{["#2456db", "#16895c", "#b57a12", "#c53a32", "#6d28d9"].map(c => <button key={c} className="h-9 w-9 rounded-lg ring-2 ring-transparent hover:ring-accent" style={{ background: c }} />)}</div></Row>
                <Row label="Logo"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-xl bg-elevated text-faint">SV</span><Button variant="outline" size="sm">Upload</Button></div></Row>
              </>)}
              {tab === "notifications" && (<>
                {["Call completed", "Campaign finished", "Agent escalation", "Weekly summary"].map((n, i) => (
                  <div key={n} className="flex items-center justify-between"><span className="text-[14px]">{n}</span><Toggle on={i !== 3} /></div>
                ))}
              </>)}
              {tab === "security" && (<>
                <div className="flex items-center justify-between rounded-xl border border-border p-4"><div><p className="text-[14px] font-500">Two-factor authentication</p><p className="text-[12px] text-muted">Add an extra layer of security</p></div><Badge tone="positive">Enabled</Badge></div>
                <div className="flex items-center justify-between rounded-xl border border-border p-4"><div><p className="text-[14px] font-500">Active sessions</p><p className="text-[12px] text-muted">2 devices currently signed in</p></div><Button variant="outline" size="sm">Manage</Button></div>
              </>)}
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
      <style jsx global>{`.inp{width:100%;border-radius:12px;border:1px solid rgb(var(--border));background:rgb(var(--surface));padding:9px 12px;font-size:14px;outline:none}.inp:focus{border-color:rgb(var(--accent));box-shadow:0 0 0 3px rgb(var(--accent)/0.12)}`}</style>
    </div>
  );
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><p className="mb-1.5 text-[12px] font-500 text-muted">{label}</p>{children}</div>;
}
function Toggle({ on }: { on: boolean }) {
  const [v, setV] = useState(on);
  return <button onClick={() => setV(!v)} className={`relative h-6 w-11 rounded-full transition-colors ${v ? "bg-accent" : "bg-border"}`}><motion.span layout className="absolute top-0.5 h-5 w-5 rounded-full bg-white shadow" style={{ left: v ? 22 : 2 }} /></button>;
}
