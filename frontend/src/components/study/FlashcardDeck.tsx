"use client";

import { useState } from "react";
import type { FlashcardDeck as FlashcardDeckType } from "@/types";

export default function FlashcardDeck({ deck }: { deck: FlashcardDeckType }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = deck.cards[index];
  const isLast = index === deck.cards.length - 1;

  function go(delta: number) {
    setFlipped(false);
    setIndex((i) => Math.min(Math.max(i + delta, 0), deck.cards.length - 1));
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-light">
          Flashcards · {deck.topic}
        </span>
        <span className="text-[11px] font-medium text-muted-light">
          {index + 1} / {deck.cards.length}
        </span>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        className="block w-full text-left cursor-pointer [perspective:1400px]"
        aria-label="Flip flashcard"
      >
        <div
          className="relative min-h-[140px] transition-transform duration-500 ease-out [transform-style:preserve-3d]"
          style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
        >
          <div className="absolute inset-0 rounded-xl border border-border bg-background px-5 py-4 flex flex-col justify-between [backface-visibility:hidden]">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-light">Question · tap to flip</span>
            <p className="font-reading text-[15px] leading-relaxed text-foreground">{card.front}</p>
          </div>
          <div
            className="absolute inset-0 rounded-xl border border-teal/30 bg-teal-soft px-5 py-4 flex flex-col justify-between [backface-visibility:hidden]"
            style={{ transform: "rotateY(180deg)" }}
          >
            <span className="text-[10px] font-semibold uppercase tracking-wider text-teal">Answer · tap to flip back</span>
            <p className="font-reading text-[15px] leading-relaxed text-foreground">{card.back}</p>
          </div>
        </div>
      </button>

      <div className="mt-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => go(-1)}
          disabled={index === 0}
          className="px-3 py-1.5 rounded-md text-xs font-medium text-muted hover:text-foreground hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          ← Previous
        </button>
        <div className="flex gap-1">
          {deck.cards.map((_, i) => (
            <span
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-colors ${i === index ? "bg-teal" : "bg-border"}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => go(1)}
          disabled={isLast}
          className="px-3 py-1.5 rounded-md text-xs font-medium text-muted hover:text-foreground hover:bg-surface-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
