"use client";

import { useEffect, useState } from "react";
import type { MockExam } from "@/types";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type Phase = "intro" | "active" | "result";

export default function MockExamBlock({ exam }: { exam: MockExam }) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() => exam.questions.map(() => null));
  const [timeLeft, setTimeLeft] = useState(exam.durationSeconds);

  useEffect(() => {
    if (phase !== "active") return;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          setPhase("result");
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  function start() {
    setPhase("active");
  }

  function choose(i: number) {
    setAnswers((a) => a.map((v, idx) => (idx === index ? i : v)));
  }

  function submit() {
    setPhase("result");
  }

  const score = answers.reduce<number>((sum, ans, i) => sum + (ans === exam.questions[i].correctIndex ? 1 : 0), 0);

  if (phase === "intro") {
    return (
      <div className="w-full text-center py-2">
        <span className="text-[11px] font-semibold text-muted-light">امتحان تجريبي · {exam.topic}</span>
        <p className="text-sm text-muted mt-2 font-reading">
          {exam.questions.length} سؤال · {formatTime(exam.durationSeconds)} على الساعة، الوقت بيبدأ لما تبدأ.
        </p>
        <button
          type="button"
          onClick={start}
          className="mt-4 px-5 py-2.5 rounded-md bg-navy text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
        >
          ابدأ الامتحان
        </button>
      </div>
    );
  }

  if (phase === "result") {
    const pct = Math.round((score / exam.questions.length) * 100);
    return (
      <div className="w-full text-center py-2">
        <span className="text-[11px] font-semibold text-muted-light">امتحان تجريبي · {exam.topic}</span>
        <p className="font-display text-3xl font-bold text-foreground mt-3">
          {score}/{exam.questions.length}
        </p>
        <p className="text-sm text-muted mt-1">{pct}% · خلصت وباقيلك {formatTime(timeLeft)}</p>
      </div>
    );
  }

  const question = exam.questions[index];
  const isLast = index === exam.questions.length - 1;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold text-muted-light">
          سؤال {index + 1} / {exam.questions.length}
        </span>
        <span
          className={`text-xs font-semibold tabular-nums px-2 py-0.5 rounded ${
            timeLeft < 30 ? "text-incorrect bg-incorrect-soft" : "text-navy bg-navy-soft"
          }`}
        >
          {formatTime(timeLeft)}
        </span>
      </div>

      <p className="text-sm font-medium text-foreground mb-3">{question.prompt}</p>
      <div className="space-y-1.5">
        {question.options.map((opt, i) => (
          <button
            key={i}
            type="button"
            onClick={() => choose(i)}
            className={`w-full text-right text-sm px-3 py-2 rounded-md border transition-colors cursor-pointer ${
              answers[index] === i
                ? "border-teal bg-teal-soft text-foreground"
                : "border-border hover:border-teal/50 hover:bg-teal-soft/40"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-muted hover:text-foreground hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
          السابق
        </button>
        {isLast ? (
          <button
            type="button"
            onClick={submit}
            className="px-4 py-1.5 rounded-md bg-navy text-white text-xs font-semibold hover:opacity-90 transition-opacity cursor-pointer"
          >
            سلّم الامتحان
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setIndex((i) => i + 1)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-muted hover:text-foreground hover:bg-surface-hover transition-colors cursor-pointer"
          >
            التالي
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
