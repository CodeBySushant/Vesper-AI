// server/lib/format.ts
// The ONLY place raw DB values become the display strings the frontend expects.
// Keeping these pure + centralized is what makes the mock→live swap invisible to
// the UI. Unit-test each one against the literals in src/lib/data.ts.

/** 108 -> "1m 48s", 38 -> "0m 38s", 0/empty -> "—" */
export function formatDuration(totalSeconds: number | null | undefined): string {
  if (totalSeconds == null || totalSeconds <= 0) return "—";
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

/** 6000 -> "0:06", 142000 -> "2:22"  (transcript clock) */
export function msToClock(ms: number): string {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** 1_258_291 -> "1.2 MB", 90112 -> "88 KB", 12288 -> "12 KB" */
export function formatBytes(bytes: bigint | number): string {
  const n = typeof bytes === "bigint" ? Number(bytes) : bytes;
  if (n < 1024) return `${n} B`;
  const kb = n / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

/** (1420000, "INR") -> "₹14,200"  — input is MINOR units (paise) */
export function formatMoney(amountMinor: number, currency = "INR"): string {
  const major = amountMinor / 100;
  const symbol = currency === "INR" ? "₹" : currency === "NPR" ? "रू" : "$";
  // Indian grouping for INR/NPR, western otherwise.
  const locale = currency === "INR" || currency === "NPR" ? "en-IN" : "en-US";
  return symbol + major.toLocaleString(locale, { maximumFractionDigits: 0 });
}

/** "+9779841041203" -> "+977 98•• 41203"  (mask middle digits) */
export function maskNumber(raw: string): string {
  const digits = raw.replace(/[^\d+]/g, "");
  if (digits.length < 7) return raw;
  const head = digits.slice(0, 5);   // country + 2
  const tail = digits.slice(-5);
  return `${head} ••${tail.slice(0, 2)} ${tail.slice(2)}`;
}

/** "LIVE" -> "live"; "NO_ANSWER" -> "No answer"; "QUALIFIED" -> "Qualified" */
export function lower(v: string): string {
  return v.toLowerCase();
}
export function titleFromEnum(v: string): string {
  const s = v.replace(/_/g, " ").toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** Date -> "2h ago" / "3d ago" / "just now" */
export function relativeTime(d: Date, now: Date = new Date()): string {
  const sec = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

/** Date -> "Today, 14:22" / "Yesterday, 09:10" / "Oct 2, 14:22" */
export function callDateLabel(d: Date, now: Date = new Date()): string {
  const sameDay = d.toDateString() === now.toDateString();
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  if (sameDay) return `Today, ${time}`;
  const y = new Date(now); y.setDate(now.getDate() - 1);
  if (d.toDateString() === y.toDateString()) return `Yesterday, ${time}`;
  return `${shortDate(d)}, ${time}`;
}

/** Date -> "Oct 2" */
export function shortDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/** Date -> "Oct 1, 2026" */
export function longDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** "Sheetal Singh" -> "SS"; "Ismail M." -> "IM" */
export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
}

/** Stable, pleasant color from a user id (deterministic, no storage). */
export function colorFor(id: string): string {
  const palette = ["#2456db", "#16895c", "#b57a12", "#c53a32", "#6d28d9", "#0e7490"];
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

/** "Aastha — Clinic Receptionist" -> "Aastha"  (UI shows short agent name) */
export function shortAgentName(name: string): string {
  return name.split(" — ")[0];
}
