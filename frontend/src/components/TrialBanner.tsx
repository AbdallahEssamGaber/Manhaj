"use client";

import Link from "next/link";

export default function TrialBanner({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="flex items-center gap-3 border-b border-teal/25 bg-teal-soft px-4 sm:px-6 py-2.5">
      <p className="flex-1 min-w-0 text-[13px] text-foreground font-reading">
        <span className="font-semibold">احفظ تقدمك</span> — سجّل حساب عشان تحتفظ بالمحادثات دي وتكمل من نفس المكان.
      </p>
      <Link
        href="/signup"
        className="shrink-0 px-3 py-1.5 rounded-md bg-teal text-white text-xs font-semibold hover:bg-teal-hover transition-colors"
      >
        سجّل مجاناً
      </Link>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 p-1 rounded-md text-muted-light hover:text-foreground hover:bg-background/60 transition-colors cursor-pointer"
        aria-label="إغلاق"
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
