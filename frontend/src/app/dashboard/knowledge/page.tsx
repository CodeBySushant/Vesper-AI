"use client";
import { motion } from "framer-motion";
import { Card, Badge, Button } from "@/components/ui";
import { PageHeader, Stagger, item } from "@/components/page-bits";
import { documents } from "@/lib/data";
import { UploadCloud, FileText, MoreHorizontal, Search } from "lucide-react";

export default function KnowledgePage() {
  return (
    <div>
      <PageHeader title="Knowledge base" sub="Upload documents your agents can answer from." />

      <Stagger>
        <motion.div variants={item}>
          <Card className="mb-4 border-dashed">
            <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-accent-soft text-accent"><UploadCloud size={22} /></span>
              <p className="mt-4 text-[15px] font-600">Drop files here or click to upload</p>
              <p className="mt-1 text-[13px] text-muted">PDF, DOCX, TXT, CSV · up to 25 MB each</p>
              <Button variant="outline" size="sm" className="mt-4">Choose files</Button>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-border p-3">
              <p className="text-[13px] font-600">{documents.length} documents</p>
              <div className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3">
                <Search size={14} className="text-faint" />
                <input placeholder="Search…" className="h-8 w-40 bg-transparent text-[13px] outline-none placeholder:text-faint" />
              </div>
            </div>
            <div className="divide-y divide-border">
              {documents.map((d) => (
                <div key={d.id} className="flex items-center justify-between px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-elevated text-faint"><FileText size={16} /></span>
                    <div><p className="text-[14px] font-500">{d.name}</p><p className="text-[12px] text-faint">{d.type} · {d.size} {d.status === "indexed" && `· ${d.chunks} chunks`}</p></div>
                  </div>
                  <div className="flex items-center gap-4">
                    {d.status === "processing"
                      ? <span className="flex items-center gap-2 text-[12px] text-warn"><span className="h-3 w-3 animate-spin rounded-full border-2 border-warn border-t-transparent" /> Indexing…</span>
                      : <Badge tone={d.status === "indexed" ? "positive" : "danger"}>{d.status}</Badge>}
                    <button className="text-faint hover:text-ink"><MoreHorizontal size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </Stagger>
    </div>
  );
}
