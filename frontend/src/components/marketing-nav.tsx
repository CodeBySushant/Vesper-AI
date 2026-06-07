"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo, Button, ThemeToggle } from "./ui";
import { cn } from "@/lib/cn";

export function MarketingNav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", on);
    return () => window.removeEventListener("scroll", on);
  }, []);
  const links = [["Product", "#product"], ["Use cases", "#usecases"], ["Pricing", "#pricing"], ["FAQ", "#faq"]];
  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-all", scrolled ? "border-b border-border bg-bg/80 backdrop-blur-xl" : "border-b border-transparent")}>
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/"><Logo /></Link>
        <div className="hidden items-center gap-1 md:flex">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-ink">{label}</a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/auth" className="hidden sm:block"><Button variant="ghost" size="sm">Sign in</Button></Link>
          <Link href="/dashboard"><Button variant="primary" size="sm">Start free</Button></Link>
        </div>
      </nav>
    </header>
  );
}
