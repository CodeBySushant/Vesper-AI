// prisma/seed.ts
// Inserts the exact entities from src/lib/data.ts so the dashboard renders
// identical content on day one — but now backed by real, editable rows.
// Run: npx prisma db seed   (after: prisma migrate dev)
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  // ── Org + owner ──────────────────────────────────────────────────────────
  const owner = await prisma.user.upsert({
    where: { email: "sheetal@vesper.ai" },
    update: {},
    create: { authId: "seed_sheetal", email: "sheetal@vesper.ai", name: "Sheetal Singh" },
  });

  const org = await prisma.organization.upsert({
    where: { slug: "sunaulo" },
    update: {},
    create: {
      name: "Vesper Voice", slug: "sunaulo", ownerId: owner.id,
      settings: { brandColor: "#2456db", defaultTimezone: "Asia/Kathmandu" },
    },
  });

  await prisma.member.upsert({
    where: { organizationId_userId: { organizationId: org.id, userId: owner.id } },
    update: {}, create: { organizationId: org.id, userId: owner.id, role: "OWNER" },
  });

  // Team (Admin / Manager / Viewer)
  const team = [
    { email: "yash@vesper.ai", name: "Yash Ranjan", role: "ADMIN" as const, authId: "seed_yash" },
    { email: "ismail@vesper.ai", name: "Ismail M.", role: "MANAGER" as const, authId: "seed_ismail" },
    { email: "anita@vesper.ai", name: "Anita Rai", role: "VIEWER" as const, authId: "seed_anita" },
  ];
  for (const t of team) {
    const u = await prisma.user.upsert({ where: { email: t.email }, update: {}, create: { authId: t.authId, email: t.email, name: t.name } });
    await prisma.member.upsert({
      where: { organizationId_userId: { organizationId: org.id, userId: u.id } },
      update: {}, create: { organizationId: org.id, userId: u.id, role: t.role },
    });
  }

  // ── Agents (full builder fields) ───────────────────────────────────────────
  const agentSeed = [
    { key: "clinic", name: "Aastha — Clinic Receptionist", description: "Appointment reminders & rescheduling for clinics", voice: "Maya (warm)", language: "Nepali · English", status: "LIVE" as const, prompt: "You are Aastha, a warm receptionist for Sunaulo Clinic." },
    { key: "lead", name: "Rohan — Lead Qualifier", description: "Qualifies real-estate enquiries, books site visits", voice: "Arjun (confident)", language: "Hindi · English", status: "LIVE" as const, prompt: "You are Rohan, a real-estate lead qualifier." },
    { key: "collect", name: "Priya — Payment Reminders", description: "Soft collection calls for microfinance", voice: "Priya (calm)", language: "Hindi", status: "PAUSED" as const, prompt: "You are Priya, a polite payment reminder agent." },
    { key: "admit", name: "Counsellor — Admissions", description: "EdTech admission counselling & follow-up", voice: "Neha (friendly)", language: "Hinglish", status: "DRAFT" as const, prompt: "You are an admissions counsellor." },
    { key: "support", name: "Sahara — Support Triage", description: "First-line support, routes to human on escalation", voice: "Maya (warm)", language: "English", status: "LIVE" as const, prompt: "You are Sahara, first-line support." },
  ];
  const agents: Record<string, string> = {};
  for (const a of agentSeed) {
    const row = await prisma.agent.create({
      data: { organizationId: org.id, name: a.name, description: a.description, voice: a.voice, language: a.language, status: a.status, prompt: a.prompt, speakingSpeed: 1.0 },
    });
    agents[a.key] = row.id;
  }

  // ── Calls + transcript for the first one ───────────────────────────────────
  const now = new Date();
  const mins = (m: number) => new Date(now.getTime() - m * 60000);
  const callSeed = [
    { agent: "clinic", number: "+9779841041203", dur: 112, outcome: "BOOKED", sentiment: "POSITIVE", ago: 38 },
    { agent: "lead", number: "+919988210000", dur: 161, outcome: "QUALIFIED", sentiment: "POSITIVE", ago: 62 },
    { agent: "collect", number: "+918011947000", dur: 38, outcome: "NO_ANSWER", sentiment: "NEUTRAL", ago: 90 },
    { agent: "support", number: "+9779877321000", dur: 192, outcome: "ESCALATED", sentiment: "NEGATIVE", ago: 133 },
    { agent: "clinic", number: "+917055098000", dur: 79, outcome: "BOOKED", sentiment: "POSITIVE", ago: 170 },
  ] as const;
  let firstCallId = "";
  for (const c of callSeed) {
    const call = await prisma.call.create({
      data: {
        organizationId: org.id, agentId: agents[c.agent], customerNumber: c.number,
        direction: "OUTBOUND", durationSeconds: c.dur, outcome: c.outcome as any,
        sentiment: c.sentiment as any, startedAt: mins(c.ago),
      },
    });
    if (!firstCallId) firstCallId = call.id;
  }
  const transcript = [
    ["agent", 0, "Namaste! Sunaulo Clinic bata Aastha bolde chu."],
    ["caller", 4000, "Yes, this is Sita speaking."],
    ["agent", 6000, "I'm calling about your appointment tomorrow at 11 AM. Will that work?"],
    ["caller", 13000, "Can we move it to the afternoon?"],
    ["agent", 16000, "I have 3:30 PM or 4:15 PM open. Which suits you?"],
    ["caller", 22000, "3:30 is perfect."],
    ["agent", 24000, "Done — confirmed for 3:30 PM. I'll send a reminder!"],
  ] as const;
  for (const [who, off, text] of transcript) {
    await prisma.callMessage.create({ data: { callId: firstCallId, speaker: who as string, offsetMs: off as number, text: text as string } });
  }

  // ── Campaigns ──────────────────────────────────────────────────────────────
  const campaignSeed = [
    { name: "October No-show Recovery", agent: "clinic", status: "RUNNING", total: 420, reached: 287 },
    { name: "Diwali Property Leads", agent: "lead", status: "SCHEDULED", total: 1200, reached: 0 },
    { name: "EMI Reminders — Sep", agent: "collect", status: "COMPLETED", total: 980, reached: 941 },
    { name: "Admission Follow-up B.Tech", agent: "admit", status: "PAUSED", total: 640, reached: 198 },
  ] as const;
  for (const c of campaignSeed) {
    const camp = await prisma.campaign.create({
      data: { organizationId: org.id, agentId: agents[c.agent], name: c.name, status: c.status as any },
    });
    // Contacts drive the derived reached/progress — create a representative few.
    const reachedCount = Math.min(c.reached, 25);
    const pendingCount = Math.min(c.total - c.reached, 25);
    for (let i = 0; i < reachedCount; i++)
      await prisma.contact.create({ data: { organizationId: org.id, campaignId: camp.id, phone: `+9198${String(1000000 + i)}`, status: "REACHED" } });
    for (let i = 0; i < pendingCount; i++)
      await prisma.contact.create({ data: { organizationId: org.id, campaignId: camp.id, phone: `+9199${String(2000000 + i)}`, status: "PENDING" } });
  }

  // ── Documents ────────────────────────────────────────────────────────────
  const docSeed = [
    { filename: "Clinic FAQ & Policies.pdf", type: "PDF", bytes: 1258291n, status: "INDEXED", chunks: 42 },
    { filename: "Doctor Schedules Oct.csv", type: "CSV", bytes: 90112n, status: "INDEXED", chunks: 18 },
    { filename: "Insurance Coverage.docx", type: "DOCX", bytes: 552960n, status: "PROCESSING", chunks: 0 },
    { filename: "Pricing & Packages.txt", type: "TXT", bytes: 12288n, status: "INDEXED", chunks: 7 },
  ] as const;
  for (const d of docSeed)
    await prisma.document.create({
      data: { organizationId: org.id, filename: d.filename, type: d.type as any, sizeBytes: d.bytes, status: d.status as any, chunkCount: d.chunks, storageKey: `org/${org.id}/seed/${d.filename}` },
    });

  // ── Phone numbers ──────────────────────────────────────────────────────────
  const phoneSeed = [
    { number: "+977 1 5970 220", provider: "Local SIP (Nepal)", agent: "clinic", type: "INBOUND" },
    { number: "+91 80 4718 9000", provider: "Exotel", agent: "lead", type: "OUTBOUND" },
    { number: "+91 22 6920 4411", provider: "Plivo", agent: "collect", type: "OUTBOUND" },
    { number: "+1 415 200 8841", provider: "Twilio", agent: "support", type: "INBOUND" },
  ] as const;
  for (const p of phoneSeed)
    await prisma.phoneNumber.create({
      data: { organizationId: org.id, agentId: agents[p.agent], number: p.number, provider: p.provider, type: p.type as any, status: "ACTIVE" },
    });

  // ── Billing: subscription + invoices ───────────────────────────────────────
  await prisma.subscription.upsert({
    where: { organizationId: org.id }, update: {},
    create: { organizationId: org.id, plan: "GROWTH", status: "ACTIVE",
              currentPeriodStart: new Date("2026-10-01"), currentPeriodEnd: new Date("2026-11-01") },
  });
  const invoiceSeed = [
    { number: "INV-2026-009", minor: 1420000, issued: "2026-10-01" },
    { number: "INV-2026-008", minor: 1285000, issued: "2026-09-01" },
    { number: "INV-2026-007", minor: 940000, issued: "2026-08-01" },
  ];
  for (const inv of invoiceSeed)
    await prisma.invoice.create({
      data: { organizationId: org.id, number: inv.number, amountMinor: inv.minor, currency: "INR", status: "PAID", issuedAt: new Date(inv.issued) },
    });

  await prisma.usageCounter.upsert({
    where: { organizationId_period: { organizationId: org.id, period: "2026-10" } },
    update: {}, create: { organizationId: org.id, period: "2026-10", aiMinutesUsed: 1910, callsCount: 1284 },
  });

  console.log("Seed complete for org", org.slug);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
