"use client";

import { useState } from "react";
import type { Quiz } from "@/types";

export default function QuizBlock({ quiz }: { quiz: Quiz }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);

  const question = quiz.questions[index];
  const isLast = index === quiz.questions.length - 1;

  function choose(i: number) {
    if (selected !== null) return;
    setSelected(i);
    if (i === question.correctIndex) setCorrectCount((c) => c + 1);
  }

  function next() {
    if (isLast) {
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }

  function retake() {
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setDone(false);
  }

  if (done) {
    const pct = Math.round((correctCount / quiz.questions.length) * 100);
    return (
      <div className="w-full text-center py-2">
        <span className="text-[11px] font-semibold text-muted-light">كويز · {quiz.topic}</span>
        <p className="font-display text-3xl font-bold text-foreground mt-3">
          {correctCount}/{quiz.questions.length}
        </p>
        <p className="text-sm text-muted mt-1">{pct}% صح</p>
        <button
          type="button"
          onClick={retake}
          className="mt-4 px-4 py-2 rounded-md border border-border text-sm font-medium text-foreground hover:bg-surface-hover transition-colors cursor-pointer"
        >
          أعد الكويز
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-semibold text-muted-light">كويز · {quiz.topic}</span>
        <span className="text-[11px] font-medium text-muted-light">
          {index + 1} / {quiz.questions.length}
        </span>
      </div>

      <p className="text-sm font-medium text-foreground mb-3">{question.prompt}</p>
      <div className="space-y-1.5">
        {question.options.map((opt, i) => {
          const isCorrect = i === question.correctIndex;
          const isSelected = selected === i;
          let state = "border-border hover:border-teal/50 hover:bg-teal-soft/60";
          if (selected !== null) {
            if (isCorrect) state = "border-correct/50 bg-correct-soft text-correct";
            else if (isSelected) state = "border-incorrect/40 bg-incorrect-soft text-incorrect";
            else state = "border-border-light opacity-50";
          }
          return (
            <button
              key={i}
              type="button"
              disabled={selected !== null}
              onClick={() => choose(i)}
              className={`w-full text-right text-sm px-3 py-2 rounded-md border transition-colors cursor-pointer disabled:cursor-default ${state}`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="mt-3 flex items-start justify-between gap-3">
          <p className="text-xs text-muted leading-relaxed font-reading">{question.explanation}</p>
          <button
            type="button"
            onClick={next}
            className="shrink-0 px-3.5 py-1.5 rounded-md bg-teal text-white text-xs font-semibold hover:bg-teal-hover transition-colors cursor-pointer"
          >
            {isLast ? "شوف نتيجتك" : "التالي"}
          </button>
        </div>
      )}
    </div>
  );
}
