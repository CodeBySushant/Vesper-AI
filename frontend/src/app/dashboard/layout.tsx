"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo, ThemeToggle, Button } from "@/components/ui";
import { CommandPalette } from "@/components/command-palette";
import { cn } from "@/lib/cn";
import {
  LayoutGrid, Bot, PhoneCall, Megaphone, BookOpen, Hash, BarChart3,
  Users, CreditCard, Settings, Search, Bell, Plus, Menu, X, Terminal,
} from "lucide-react";

const nav = [
  { label: "Overview", href: "/dashboard", icon: LayoutGrid },
  { label: "Agents", href: "/dashboard/agents", icon: Bot },
  { label: "Calls", href: "/dashboard/calls", icon: PhoneCall },
  { label: "Campaigns", href: "/dashboard/campaigns", icon: Megaphone },
  { label: "Knowledge Base", href: "/dashboard/knowledge", icon: BookOpen },
  { label: "Phone Numbers", href: "/dashboard/numbers", icon: Hash },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { label: "Team", href: "/dashboard/team", icon: Users },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-bg">
      <CommandPalette />

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border bg-surface/60 backdrop-blur-xl transition-transform lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center justify-between px-5">
          <Link href="/"><Logo /></Link>
          <button className="lg:hidden" onClick={() => setMobileOpen(false)}><X size={18} /></button>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto scrollbar-thin px-3 py-2">
          {nav.map((n) => {
            const active = pathname === n.href || (n.href !== "/dashboard" && pathname.startsWith(n.href));
            return (
              <Link key={n.href} href={n.href} onClick={() => setMobileOpen(false)}
                className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active ? "bg-elevated font-500 text-ink" : "text-muted hover:bg-elevated/60 hover:text-ink")}>
                <n.icon size={17} className={active ? "text-accent" : ""} /> {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-[12px] font-600 text-white">SS</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-500">Sheetal Singh</p>
              <p className="truncate text-[11px] text-faint">Growth plan</p>
            </div>
          </div>
        </div>
      </aside>

      {mobileOpen && <div className="fixed inset-0 z-30 bg-ink/30 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Main */}
      <div className="flex flex-1 flex-col lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-bg/80 px-5 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setMobileOpen(true)}><Menu size={20} /></button>
            <button onClick={() => { const e = new KeyboardEvent("keydown", { key: "k", metaKey: true }); window.dispatchEvent(e); }}
              className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-[13px] text-faint transition-colors hover:text-muted">
              <Search size={14} /> <span className="hidden sm:inline">Search…</span>
              <kbd className="ml-2 hidden items-center gap-0.5 rounded border border-border px-1.5 py-0.5 font-mono text-[10px] sm:flex">⌘K</kbd>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/api"><Button variant="ghost" size="sm"><Terminal size={15} /> <span className="hidden sm:inline">API</span></Button></Link>
            <button className="relative grid h-9 w-9 place-items-center rounded-xl border border-border bg-surface text-muted hover:text-ink">
              <Bell size={16} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent" />
            </button>
            <ThemeToggle />
            <Link href="/dashboard/agents/builder"><Button variant="primary" size="sm"><Plus size={15} /> <span className="hidden sm:inline">New agent</span></Button></Link>
          </div>
        </header>
        <main className="flex-1 px-5 py-7">{children}</main>
      </div>
    </div>
  );
}
