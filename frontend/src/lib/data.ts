// Centralized mock data. Swap these for real API calls later.

export const BRAND = {
  name: "Vesper",
  tagline: "Voice agents that sound human.",
};

export type Agent = {
  id: string;
  name: string;
  description: string;
  voice: string;
  language: string;
  status: "live" | "draft" | "paused";
  calls: number;
  successRate: number;
  avgDuration: string;
  updated: string;
};

export const agents: Agent[] = [
  { id: "ag_clinic", name: "Aastha — Clinic Receptionist", description: "Appointment reminders & rescheduling for clinics", voice: "Maya (warm)", language: "Nepali · English", status: "live", calls: 1284, successRate: 91, avgDuration: "1m 48s", updated: "2h ago" },
  { id: "ag_lead", name: "Rohan — Lead Qualifier", description: "Qualifies real-estate enquiries, books site visits", voice: "Arjun (confident)", language: "Hindi · English", status: "live", calls: 842, successRate: 78, avgDuration: "2m 12s", updated: "5h ago" },
  { id: "ag_collect", name: "Priya — Payment Reminders", description: "Soft collection calls for microfinance", voice: "Priya (calm)", language: "Hindi", status: "paused", calls: 2106, successRate: 64, avgDuration: "1m 22s", updated: "1d ago" },
  { id: "ag_admit", name: "Counsellor — Admissions", description: "EdTech admission counselling & follow-up", voice: "Neha (friendly)", language: "Hinglish", status: "draft", calls: 0, successRate: 0, avgDuration: "—", updated: "3d ago" },
  { id: "ag_support", name: "Sahara — Support Triage", description: "First-line support, routes to human on escalation", voice: "Maya (warm)", language: "English", status: "live", calls: 564, successRate: 86, avgDuration: "2m 40s", updated: "6h ago" },
];

export type Call = {
  id: string;
  caller: string;
  agent: string;
  duration: string;
  outcome: "Booked" | "Qualified" | "No answer" | "Escalated" | "Resolved" | "Declined";
  sentiment: "positive" | "neutral" | "negative";
  date: string;
};

export const calls: Call[] = [
  { id: "c_1", caller: "+977 98•• 41203", agent: "Aastha", duration: "1m 52s", outcome: "Booked", sentiment: "positive", date: "Today, 14:22" },
  { id: "c_2", caller: "+91 99•• 88210", agent: "Rohan", duration: "2m 41s", outcome: "Qualified", sentiment: "positive", date: "Today, 13:58" },
  { id: "c_3", caller: "+91 80•• 11947", agent: "Priya", duration: "0m 38s", outcome: "No answer", sentiment: "neutral", date: "Today, 13:30" },
  { id: "c_4", caller: "+977 98•• 77321", agent: "Sahara", duration: "3m 12s", outcome: "Escalated", sentiment: "negative", date: "Today, 12:47" },
  { id: "c_5", caller: "+91 70•• 55098", agent: "Aastha", duration: "1m 19s", outcome: "Booked", sentiment: "positive", date: "Today, 12:10" },
  { id: "c_6", caller: "+91 98•• 33471", agent: "Rohan", duration: "2m 02s", outcome: "Declined", sentiment: "negative", date: "Today, 11:35" },
  { id: "c_7", caller: "+977 98•• 90021", agent: "Sahara", duration: "2m 55s", outcome: "Resolved", sentiment: "positive", date: "Today, 10:58" },
  { id: "c_8", caller: "+91 99•• 67120", agent: "Priya", duration: "1m 07s", outcome: "Booked", sentiment: "neutral", date: "Today, 10:22" },
];

export const transcript = [
  { who: "agent", t: "0:00", text: "Namaste! Sunaulo Clinic bata Aastha bolde chu. Ke ma Sita ji sanga kura garna sakchu?" },
  { who: "caller", t: "0:04", text: "Yes, this is Sita speaking." },
  { who: "agent", t: "0:06", text: "Dhanyabad Sita ji. I'm calling about your appointment with Dr. Sharma tomorrow at 11 AM. Will that still work for you?" },
  { who: "caller", t: "0:13", text: "Actually, can we move it to the afternoon?" },
  { who: "agent", t: "0:16", text: "Of course. I have 3:30 PM or 4:15 PM open tomorrow. Which suits you better?" },
  { who: "caller", t: "0:22", text: "3:30 is perfect." },
  { who: "agent", t: "0:24", text: "Done — you're confirmed for tomorrow at 3:30 PM with Dr. Sharma. I'll send a reminder. Have a lovely day!" },
];

export type Campaign = {
  id: string;
  name: string;
  agent: string;
  status: "running" | "scheduled" | "completed" | "paused";
  contacts: number;
  reached: number;
  progress: number;
  created: string;
};

export const campaigns: Campaign[] = [
  { id: "cm_1", name: "October No-show Recovery", agent: "Aastha", status: "running", contacts: 420, reached: 287, progress: 68, created: "Oct 2" },
  { id: "cm_2", name: "Diwali Property Leads", agent: "Rohan", status: "scheduled", contacts: 1200, reached: 0, progress: 0, created: "Oct 5" },
  { id: "cm_3", name: "EMI Reminders — Sep", agent: "Priya", status: "completed", contacts: 980, reached: 941, progress: 100, created: "Sep 1" },
  { id: "cm_4", name: "Admission Follow-up B.Tech", agent: "Counsellor", status: "paused", contacts: 640, reached: 198, progress: 31, created: "Sep 22" },
];

export type Doc = { id: string; name: string; type: string; size: string; status: "indexed" | "processing" | "failed"; chunks: number };
export const documents: Doc[] = [
  { id: "d_1", name: "Clinic FAQ & Policies.pdf", type: "PDF", size: "1.2 MB", status: "indexed", chunks: 42 },
  { id: "d_2", name: "Doctor Schedules Oct.csv", type: "CSV", size: "88 KB", status: "indexed", chunks: 18 },
  { id: "d_3", name: "Insurance Coverage.docx", type: "DOCX", size: "540 KB", status: "processing", chunks: 0 },
  { id: "d_4", name: "Pricing & Packages.txt", type: "TXT", size: "12 KB", status: "indexed", chunks: 7 },
];

export const phoneNumbers = [
  { id: "p_1", number: "+977 1 5970 220", provider: "Local SIP (Nepal)", agent: "Aastha", type: "Inbound", status: "active" },
  { id: "p_2", number: "+91 80 4718 9000", provider: "Exotel", agent: "Rohan", type: "Outbound", status: "active" },
  { id: "p_3", number: "+91 22 6920 4411", provider: "Plivo", agent: "Priya", type: "Outbound", status: "active" },
  { id: "p_4", number: "+1 415 200 8841", provider: "Twilio", agent: "Sahara", type: "Inbound", status: "active" },
];

export const team = [
  { id: "u_1", name: "Sheetal Singh", email: "sheetal@vesper.ai", role: "Owner", initials: "SS", color: "#2456db" },
  { id: "u_2", name: "Yash Ranjan", email: "yash@vesper.ai", role: "Admin", initials: "YR", color: "#16895c" },
  { id: "u_3", name: "Ismail M.", email: "ismail@vesper.ai", role: "Manager", initials: "IM", color: "#b57a12" },
  { id: "u_4", name: "Anita Rai", email: "anita@vesper.ai", role: "Viewer", initials: "AR", color: "#c53a32" },
];

export const invoices = [
  { id: "in_1", number: "INV-2026-009", date: "Oct 1, 2026", amount: "₹14,200", status: "Paid" },
  { id: "in_2", number: "INV-2026-008", date: "Sep 1, 2026", amount: "₹12,850", status: "Paid" },
  { id: "in_3", number: "INV-2026-007", date: "Aug 1, 2026", amount: "₹9,400", status: "Paid" },
];

// Charts
export const callVolume = [
  { d: "Mon", calls: 220, booked: 142 }, { d: "Tue", calls: 312, booked: 201 },
  { d: "Wed", calls: 280, booked: 178 }, { d: "Thu", calls: 398, booked: 264 },
  { d: "Fri", calls: 420, booked: 291 }, { d: "Sat", calls: 351, booked: 233 },
  { d: "Sun", calls: 189, booked: 121 },
];

export const outcomeFunnel = [
  { stage: "Dialed", value: 4200 },
  { stage: "Connected", value: 3180 },
  { stage: "Engaged", value: 2410 },
  { stage: "Qualified", value: 1490 },
  { stage: "Booked", value: 921 },
];

export const langSplit = [
  { name: "Nepali", value: 38 }, { name: "Hindi", value: 31 },
  { name: "Hinglish", value: 19 }, { name: "English", value: 12 },
];

export const kpis = [
  { label: "Active agents", value: "4", delta: "+1", trend: "up" as const },
  { label: "Calls today", value: "1,284", delta: "+12.4%", trend: "up" as const },
  { label: "Minutes used", value: "3,910", delta: "+8.1%", trend: "up" as const },
  { label: "Conversion rate", value: "21.9%", delta: "+3.2pts", trend: "up" as const },
  { label: "Est. revenue impact", value: "₹4.2L", delta: "+18%", trend: "up" as const },
];

export const activity = [
  { who: "Aastha", what: "booked an appointment", when: "2 min ago", kind: "success" as const },
  { who: "Rohan", what: "qualified a lead (₹1.2Cr property)", when: "14 min ago", kind: "success" as const },
  { who: "Sahara", what: "escalated a call to human", when: "31 min ago", kind: "warn" as const },
  { who: "Priya", what: "completed EMI reminder batch", when: "1 hr ago", kind: "neutral" as const },
  { who: "You", what: "published agent “Aastha”", when: "2 hr ago", kind: "neutral" as const },
];

export const pricing = [
  {
    name: "Starter", price: "₹2,499", period: "/mo",
    tagline: "For solo clinics & first pilots",
    features: ["1 voice agent", "500 AI minutes / mo", "Inbound or outbound", "Basic analytics", "Email support", "1 phone number"],
    cta: "Start free trial", highlight: false,
  },
  {
    name: "Growth", price: "₹8,999", period: "/mo",
    tagline: "For growing SMBs & agencies",
    features: ["5 voice agents", "3,000 AI minutes / mo", "CRM + WhatsApp", "Appointment booking", "Campaign management", "Priority support"],
    cta: "Start free trial", highlight: true,
  },
  {
    name: "Enterprise", price: "Custom", period: "",
    tagline: "For BFSI & high-volume teams",
    features: ["Unlimited agents", "Committed minutes", "White-label", "On-prem / sovereign option", "Compliance suite (DLT, consent)", "Dedicated CSM + SLA"],
    cta: "Talk to sales", highlight: false,
  },
];

export const faqs = [
  { q: "Does it really sound human?", a: "We use premium neural voices and tuned turn-taking so conversations feel natural — no robotic monotone, no awkward pauses. You can preview any voice before going live." },
  { q: "Which languages are supported?", a: "Nepali, Hindi, Hinglish, and English at launch, with code-switching support. More regional Indian languages roll out in Phase 3." },
  { q: "Is AI calling compliant in India?", a: "We build consent capture, AI self-disclosure, time-window enforcement and TRAI DLT readiness directly into the platform. You stay compliant by default." },
  { q: "Can I bring my own phone numbers?", a: "Yes. Connect Exotel, Plivo, Twilio or a local SIP trunk. We never lock you into a single telephony provider." },
  { q: "How long to go live?", a: "Most teams launch a working agent in under a day using our templates. Done-for-you onboarding is available on Growth and above." },
  { q: "What happens when the AI can't handle a call?", a: "You define escalation rules. The agent hands off to a human teammate or logs a callback — gracefully, mid-conversation." },
];

export const logos = ["Sunaulo Clinic", "MetroHomes", "FinSakhi", "EduPath", "CareFirst", "UrbanStay"];
