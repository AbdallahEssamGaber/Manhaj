import Link from "next/link";
import Logo from "@/components/Logo";
import { universities } from "@/lib/universities";

const benefits = [
  {
    title: "Cheap, subject-specific help",
    detail: "A fraction of the cost of a tutor — answers tuned to your exact course, not the whole internet.",
  },
  {
    title: "Trained on real course content",
    detail: "Slides, past exams, and lecture notes your professor actually assigned — not generic web results.",
  },
  {
    title: "Always available",
    detail: "3am before the final or between back-to-back lectures — Manhaj doesn't keep office hours.",
  },
];

const sourceTypes = [
  { label: "Lecture slides", detail: "Every deck your professor actually posted, not a generic summary of the topic." },
  { label: "Past exams", detail: "Real questions from real midterms and finals, organized by course and year." },
  { label: "Official curriculum docs", detail: "The syllabus and course outline your department publishes, so scope stays accurate." },
  { label: "Lecture notes", detail: "TA notes and section recordings' transcripts, and anything else your course shares." },
];

const studyWays = [
  { label: "Ask", detail: "Get a straight answer with the exact slide or exam it came from, cited inline." },
  { label: "Flashcards", detail: "Flip through a deck generated from your material — good for drilling terms fast." },
  { label: "Quiz & Mock Exam", detail: "Scored multiple-choice, or a timed session that mirrors the real thing." },
];

const rotations = ["-rotate-2", "rotate-1", "-rotate-1"];

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Nav */}
      <header className="border-b border-border-light">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Logo size={26} />
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/login" className="hidden sm:inline-block px-3 py-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="px-4 py-1.5 rounded-md bg-teal text-white text-sm font-medium hover:bg-teal-hover transition-colors"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-14 sm:pt-20 pb-16 sm:pb-24">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-soft text-navy text-xs font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-teal" />
              Built on your curriculum, not the internet&apos;s
            </div>
            <h1 className="font-display text-[clamp(2.4rem,5.2vw,3.75rem)] leading-[1.05] font-bold text-foreground">
              Study your <span className="text-teal">actual</span> course. Not a summary of it.
            </h1>
            <p className="mt-6 text-base sm:text-lg text-muted leading-relaxed max-w-lg font-reading">
              Manhaj reads your real slides, past exams, and lecture notes — then answers, quizzes, and drills you on exactly what your professor taught.
            </p>

            <ul className="mt-8 space-y-3 max-w-md">
              {benefits.map((b) => (
                <li key={b.title} className="flex gap-3">
                  <svg className="mt-0.5 shrink-0 text-teal" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-foreground">
                    <span className="font-semibold">{b.title}</span>
                    <span className="text-muted"> — {b.detail}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/chat"
                className="px-6 py-3 rounded-md bg-teal text-white text-sm font-semibold hover:bg-teal-hover transition-colors"
              >
                Start chatting now
              </Link>
              <Link
                href="/signup"
                className="px-6 py-3 rounded-md border border-border text-sm font-semibold text-foreground hover:bg-surface-hover transition-colors"
              >
                Sign up
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-light">No account needed to try it — just pick your university and start.</p>
          </div>

          {/* Product preview */}
          <div className="relative">
            <div className="rounded-xl border border-border bg-surface shadow-[0_20px_50px_-20px_oklch(0.28_0.06_258_/_0.28)] overflow-hidden">
              <div className="flex items-center gap-1 px-3 py-2 border-b border-border">
                {["Ask", "Flashcards", "Quiz"].map((label, i) => (
                  <span key={label} className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${i === 1 ? "bg-teal text-white" : "text-muted"}`}>
                    {label}
                  </span>
                ))}
              </div>
              <div className="p-4 space-y-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-teal-soft text-teal font-semibold px-3 py-1 text-[13px]">
                  <span className="w-4 h-4 rounded-full bg-teal text-white text-[9px] font-bold flex items-center justify-center">DS</span>
                  Data Structures
                </span>
                <div className="rounded-lg border border-teal/25 bg-teal-soft px-4 py-3.5">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-teal">Flashcard</span>
                  <p className="text-sm leading-relaxed text-foreground mt-1 font-reading">
                    What is a binary search tree? — A tree where every left value is smaller and every right value larger.
                  </p>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[75%] rounded-lg px-3.5 py-2 bg-user-bubble text-user-bubble-text text-sm">/flashcards binary trees</div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-5 hidden sm:block rounded-lg border border-border bg-surface px-3 py-2 shadow-md rotate-[-4deg]">
              <p className="text-[11px] font-medium text-muted">Source: Lecture 4, slide 12</p>
            </div>
          </div>
        </div>
      </section>

      {/* Grounded in real material */}
      <section className="border-t border-border-light bg-surface">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16">
            <div>
              <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight font-bold text-foreground">
                Every answer traces back to your course.
              </h2>
              <p className="mt-4 text-muted leading-relaxed max-w-sm font-reading">
                Other AI tools guess from the open web. Manhaj is grounded in what your professor actually assigned — so it never invents scope that isn&apos;t on your exam.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
              {sourceTypes.map((s, i) => (
                <div key={s.label} className={i % 2 === 1 ? "sm:mt-8" : ""}>
                  <p className="font-display text-2xl font-bold text-teal/25">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-1 text-base font-semibold text-foreground">{s.label}</h3>
                  <p className="mt-1.5 text-sm text-muted leading-relaxed font-reading">{s.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Study modes */}
      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-24">
        <div className="max-w-xl">
          <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight font-bold text-foreground">
            Study however the exam is coming at you.
          </h2>
          <p className="mt-4 text-muted leading-relaxed font-reading">
            Switch modes right from the chat — the same course material, three different ways to drill it.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap gap-5 sm:gap-6">
          {studyWays.map((m, i) => (
            <div
              key={m.label}
              className={`w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] rounded-xl border border-border bg-surface p-5 transition-transform hover:rotate-0 hover:-translate-y-1 ${rotations[i % rotations.length]}`}
            >
              <span className="inline-block text-xs font-semibold text-teal uppercase tracking-wider">{m.label}</span>
              <p className="mt-2 text-sm text-foreground leading-relaxed font-reading">{m.detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Universities */}
      <section className="border-t border-border-light bg-surface">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <h2 className="font-display text-[clamp(1.75rem,3vw,2.5rem)] leading-tight font-bold text-foreground">
              Pick your university, get your curriculum.
            </h2>
            <p className="text-sm text-muted max-w-xs font-reading">
              Choose your school, major, and year in under a minute — no account required to start.
            </p>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-11 gap-3">
            {universities.map((uni) => (
              <div key={uni.id} className="aspect-square rounded-xl flex items-center justify-center" style={{ backgroundColor: uni.bg }} title={uni.name}>
                <span className="font-display text-sm sm:text-base font-bold" style={{ color: uni.text }}>
                  {uni.shortName}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-navy">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20 relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
          <div>
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.75rem)] leading-tight font-bold text-white max-w-lg">
              Stop studying from the wrong material.
            </h2>
            <p className="mt-3 text-white/80 max-w-md font-reading">Free to start, no account needed. Pick your university and your first subject in under a minute.</p>
          </div>
          <Link
            href="/chat"
            className="shrink-0 self-start sm:self-auto px-7 py-3.5 rounded-md bg-teal text-white text-sm font-semibold hover:bg-teal-hover transition-colors"
          >
            Start chatting now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-light">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size={22} className="opacity-90" />
          <p className="text-xs text-muted-light">Manhaj means &ldquo;curriculum&rdquo; — study by subject, grounded in your own material.</p>
        </div>
      </footer>
    </div>
  );
}
