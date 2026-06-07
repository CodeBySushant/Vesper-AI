"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Logo, Button } from "@/components/ui";
import { CallCard } from "@/components/call-card";
import { ArrowRight, Mail, Lock, User } from "lucide-react";

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const router = useRouter();

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left — form */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/"><Logo /></Link>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="mt-10 font-display text-[28px] font-600 tracking-tight">{mode === "signin" ? "Welcome back" : "Create your workspace"}</h1>
            <p className="mt-1.5 text-sm text-muted">{mode === "signin" ? "Sign in to your Vesper dashboard." : "Start your 14-day free trial. No card required."}</p>

            <div className="mt-7 space-y-3">
              <button className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-border bg-surface text-sm font-500 transition-colors hover:bg-elevated">
                <svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg>
                Continue with Google
              </button>
              <div className="flex items-center gap-3 py-1"><span className="h-px flex-1 bg-border" /><span className="text-[11px] text-faint">or</span><span className="h-px flex-1 bg-border" /></div>

              {mode === "signup" && <InputRow icon={<User size={15} />} placeholder="Full name" />}
              <InputRow icon={<Mail size={15} />} placeholder="Work email" type="email" />
              <InputRow icon={<Lock size={15} />} placeholder="Password" type="password" />

              <Button variant="primary" size="lg" className="w-full" onClick={() => router.push("/dashboard")}>
                {mode === "signin" ? "Sign in" : "Create workspace"} <ArrowRight size={16} />
              </Button>
            </div>

            <p className="mt-6 text-center text-[13px] text-muted">
              {mode === "signin" ? "New to Vesper? " : "Already have an account? "}
              <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="font-500 text-accent hover:underline">
                {mode === "signin" ? "Create an account" : "Sign in"}
              </button>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right — atmosphere */}
      <div className="relative hidden items-center justify-center overflow-hidden border-l border-border bg-surface/40 lg:flex">
        <div className="pointer-events-none absolute inset-0 dot-grid opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
        <div className="relative z-10 px-12">
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7 }}>
            <CallCard />
          </motion.div>
          <p className="mx-auto mt-8 max-w-xs text-center font-display text-lg italic text-muted">“It books appointments while we sleep — and patients think it's our receptionist.”</p>
          <p className="mt-2 text-center text-[13px] text-faint">— Sunaulo Clinic, Kathmandu</p>
        </div>
      </div>
    </div>
  );
}

function InputRow({ icon, placeholder, type = "text" }: { icon: React.ReactNode; placeholder: string; type?: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-border bg-surface px-3 focus-within:border-accent focus-within:shadow-[0_0_0_3px_rgb(var(--accent)/0.12)]">
      <span className="text-faint">{icon}</span>
      <input type={type} placeholder={placeholder} className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-faint" />
    </div>
  );
}
