"use client";

import { useMemo, useState } from "react";
import { universities } from "@/lib/universities";
import type { StudyProfile, University } from "@/types";
import { LogoMark } from "@/components/Logo";

interface OnboardingModalProps {
  onComplete: (profile: StudyProfile) => void;
}

const steps = ["الجامعة", "التخصص", "السنة"] as const;

export default function OnboardingModal({ onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(0);
  const [search, setSearch] = useState("");
  const [university, setUniversity] = useState<University | null>(null);
  const [majorId, setMajorId] = useState<string | null>(null);
  const [year, setYear] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return universities;
    return universities.filter((u) => u.name.toLowerCase().includes(q) || u.shortName.toLowerCase().includes(q));
  }, [search]);

  const selectedMajor = university?.majors.find((m) => m.id === majorId) ?? null;

  function selectUniversity(u: University) {
    setUniversity(u);
    setMajorId(null);
    setYear(null);
    setStep(1);
  }

  function selectMajor(id: string) {
    setMajorId(id);
    setYear(1);
    setStep(2);
  }

  function handleSubmit() {
    if (!university || !majorId || !year) return;
    onComplete({ universityId: university.id, majorId, year });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-surface shadow-[0_30px_70px_-25px_oklch(0.28_0.06_258_/_0.35)] overflow-hidden">
        {/* Header */}
        <div className="px-6 sm:px-8 pt-6 sm:pt-7 pb-5 border-b border-border-light">
          <div className="flex items-center gap-2.5 mb-5">
            <LogoMark size={24} />
            <span className="text-sm font-semibold text-foreground">جهّز مساحة مذاكرتك</span>
          </div>
          <div className="flex items-center gap-2">
            {steps.map((label, i) => (
              <div key={label} className="flex-1">
                <div
                  className={`h-1 rounded-full transition-colors ${
                    i <= step ? "bg-teal" : "bg-border"
                  }`}
                />
                <span
                  className={`mt-1.5 block text-[11px] font-medium ${
                    i === step ? "text-teal" : "text-muted-light"
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="px-6 sm:px-8 py-6 min-h-[320px]">
          {step === 0 && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">جامعتك إيه؟</h2>
              <p className="text-sm text-muted mb-4 font-reading">هنظبط المواد وأوضاع المذاكرة على أساسها.</p>
              <div className="relative mb-4">
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-light"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="11" cy="11" r="7" />
                  <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
                </svg>
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="دور على جامعتك..."
                  className="w-full rounded-lg border border-border bg-background pr-9 pl-3 py-2.5 text-sm text-foreground placeholder-muted-light focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition-colors"
                />
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-[220px] overflow-y-auto pl-1">
                {filtered.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => selectUniversity(u)}
                    className="group flex flex-col items-center gap-1.5 rounded-xl p-2.5 text-center transition-transform hover:-translate-y-0.5 cursor-pointer"
                    style={{ backgroundColor: u.bg }}
                  >
                    {u.logo ? (
                      <img src={u.logo} alt={u.name} className="h-8 max-w-full object-contain" />
                    ) : (
                      <span className="font-display text-lg font-bold leading-none" style={{ color: u.text }}>
                        {u.shortName}
                      </span>
                    )}
                    <span className="text-[10px] font-medium leading-tight" style={{ color: u.text }}>
                      {u.name}
                    </span>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="col-span-full text-sm text-muted-light py-8 text-center">مفيش نتايج — جرب تكتب الاسم بطريقة تانية.</p>
                )}
              </div>
            </div>
          )}

          {step === 1 && university && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">إيه تخصصك؟</h2>
              <p className="text-sm text-muted mb-4 font-reading">
                في <span className="font-medium text-foreground">{university.name}</span>.
              </p>
              <div className="grid sm:grid-cols-2 gap-2.5">
                {university.majors.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => selectMajor(m.id)}
                    className="text-right rounded-lg border border-border bg-background px-4 py-3 hover:border-teal hover:bg-teal-soft transition-colors cursor-pointer"
                  >
                    <span className="block text-sm font-semibold text-foreground">{m.name}</span>
                    <span className="block text-xs text-muted-light mt-0.5">برنامج {m.years} سنين</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && university && selectedMajor && year && (
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-1">انت في أنهي سنة؟</h2>
              <p className="text-sm text-muted mb-6 font-reading">
                افترضنا إنك في السنة الأولى في {selectedMajor.name} — غيّرها لو مش كده.
              </p>
              <div className="flex items-center gap-3">
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-foreground focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition-colors cursor-pointer"
                >
                  {Array.from({ length: selectedMajor.years }, (_, i) => i + 1).map((y) => (
                    <option key={y} value={y}>
                      السنة {y}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-5 rounded-lg bg-sky-soft px-4 py-3 text-sm text-foreground font-reading">
                {university.shortName} · {selectedMajor.name} · السنة {year}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 sm:px-8 pb-6 sm:pb-7 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className={`text-sm font-medium text-muted hover:text-foreground transition-colors cursor-pointer ${
              step === 0 ? "invisible" : ""
            }`}
          >
            رجوع
          </button>
          {step === 2 && (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 rounded-lg bg-teal text-white text-sm font-semibold hover:bg-teal-hover transition-colors cursor-pointer"
            >
              ابدأ المذاكرة
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
