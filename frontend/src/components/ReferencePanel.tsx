"use client";

import { useEffect, useRef } from "react";
import { getSourceDocument } from "@/lib/sources";
import type { Reference } from "@/types";

interface ReferencePanelProps {
  reference: Reference | null;
  onClose: () => void;
}

export default function ReferencePanel({ reference, onClose }: ReferencePanelProps) {
  const highlightRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (reference) {
      highlightRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [reference]);

  if (!reference) return null;
  const doc = getSourceDocument(reference.label, reference.quote);

  return (
    <aside className="w-[340px] shrink-0 border-r border-border bg-surface flex flex-col h-full animate-[slide-in_0.2s_ease-out]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="min-w-0">
          <span className="text-[10px] font-semibold text-muted-light">المصدر [{reference.index}]</span>
          <p className="text-sm font-semibold text-foreground truncate">{doc.title}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-md text-muted-light hover:text-foreground hover:bg-surface-hover transition-colors cursor-pointer shrink-0"
          aria-label="إغلاق لوحة المصدر"
        >
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {doc.paragraphs.map((p, i) =>
          i === doc.highlightIndex ? (
            <div key={i} ref={highlightRef} className="rounded-lg border border-teal/40 bg-teal-soft px-3.5 py-3">
              <span className="block text-[10px] font-semibold text-teal mb-1">الفقرة المُشار إليها</span>
              <p className="font-reading text-[14px] leading-relaxed text-foreground">{p}</p>
            </div>
          ) : (
            <p key={i} className="font-reading text-[14px] leading-relaxed text-muted">
              {p}
            </p>
          )
        )}
      </div>
    </aside>
  );
}
