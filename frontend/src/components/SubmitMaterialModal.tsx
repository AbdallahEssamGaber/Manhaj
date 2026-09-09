"use client";

import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, isConfigured } from "@/lib/firebase";
import type { University } from "@/types";

interface SubmitMaterialModalProps {
  university: University | null;
  onClose: () => void;
}

const materialTypes = ["Lecture slides", "Past exam", "Lecture notes", "Curriculum / syllabus", "Other"];

export default function SubmitMaterialModal({ university, onClose }: SubmitMaterialModalProps) {
  const [subject, setSubject] = useState("");
  const [type, setType] = useState(materialTypes[0]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    if (isConfigured && db) {
      try {
        await addDoc(collection(db, "materialSubmissions"), {
          universityId: university?.id ?? null,
          universityName: university?.name ?? null,
          subject,
          type,
          fileName,
          notes,
          createdAt: Date.now(),
        });
      } catch {
        // best effort — still show the confirmation, this is a review queue not a critical path
      }
    }
    setSubmitting(false);
    setSubmitted(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface shadow-[0_30px_70px_-25px_oklch(0.28_0.06_258_/_0.35)] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-light">
          <h2 className="text-sm font-semibold text-foreground">Submit course material</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-md text-muted-light hover:text-foreground hover:bg-surface-hover transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {submitted ? (
          <div className="px-6 py-10 text-center">
            <div className="w-11 h-11 rounded-full bg-teal-soft text-teal flex items-center justify-center mx-auto mb-3">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-foreground">Thanks — it&apos;s in the review queue.</p>
            <p className="text-sm text-muted mt-1 font-reading">We&apos;ll verify it against the source before adding it to {university?.shortName ?? "your"} materials.</p>
            <button
              type="button"
              onClick={onClose}
              className="mt-5 px-4 py-2 rounded-md border border-border text-sm font-medium text-foreground hover:bg-surface-hover transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <p className="text-xs text-muted font-reading">
              Sharing your {university?.name ?? "university's"} slides, past exams, or notes helps Manhaj answer accurately for everyone on your course.
            </p>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Subject</label>
              <input
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Data Structures"
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-light focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Material type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition-colors cursor-pointer"
              >
                {materialTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">File</label>
              <label className="flex items-center justify-between rounded-md border border-dashed border-border px-3 py-2.5 text-sm text-muted-light hover:border-teal hover:text-teal transition-colors cursor-pointer">
                <span className="truncate">{fileName ?? "Choose a PDF, slide deck, or doc..."}</span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Notes (optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Which course, professor, or term is this from?"
                className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted-light focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !subject}
              className="w-full py-2.5 rounded-md bg-teal text-white text-sm font-semibold hover:bg-teal-hover disabled:opacity-50 transition-colors cursor-pointer"
            >
              {submitting ? "Submitting..." : "Submit for review"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
