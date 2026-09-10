"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Message, Reference } from "@/types";
import { monogram } from "@/lib/subjects";
import { studyModeButtons, topicPlaceholder, questionPlaceholder } from "@/lib/studyModes";
import FlashcardDeck from "@/components/study/FlashcardDeck";
import QuizBlock from "@/components/study/QuizBlock";
import MockExamBlock from "@/components/study/MockExamBlock";

interface ChatWindowProps {
  messages: Message[];
  subject: string;
  onSend: (rawInput: string) => void;
  loading: boolean;
  onOpenReference: (ref: Reference) => void;
  activeReferenceIndex: number | null;
}

const modeIcons: Record<string, ReactNode> = {
  flashcards: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <rect x="4.3" y="8.3" width="12" height="9" rx="1.5" transform="rotate(-8 10.3 12.8)" />
      <rect x="7.5" y="6.5" width="12" height="9" rx="1.5" fill="var(--surface)" />
    </svg>
  ),
  quiz: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="8.2" />
      <path d="M9.6 9.4a2.5 2.5 0 114.2 1.8c-.7.6-1.7 1-1.7 2.4" />
      <circle cx="12" cy="16.4" r="0.55" fill="currentColor" stroke="none" />
    </svg>
  ),
  mockexam: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12.5" r="8.2" />
      <path d="M12 7.7v4.8l3.1 2" />
      <path d="M9.5 2.5h5" />
    </svg>
  ),
};

function SourcesCaption({ sources }: { sources?: string[] }) {
  if (!sources || sources.length === 0) return null;
  return (
    <p className="mt-3 pt-2.5 border-t border-border-light text-[11px] text-muted-light">
      المصدر: <span className="font-medium text-muted">{sources.join("، ")}</span>
    </p>
  );
}

function SubjectBadge({ subject }: { subject: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-teal-soft text-teal font-semibold px-3 py-1 text-[13px]">
      <span className="w-4 h-4 rounded-full bg-teal text-white text-[9px] font-bold flex items-center justify-center shrink-0">
        {monogram(subject)}
      </span>
      {subject}
    </span>
  );
}

/** Splits answer text on inline [n] markers into clickable reference chips. */
function AnswerText({ content, sources, onOpenReference, activeReferenceIndex }: {
  content: string;
  sources?: string[];
  onOpenReference: (ref: Reference) => void;
  activeReferenceIndex: number | null;
}) {
  const parts = content.split(/(\[\d+\])/g);
  const { nodes } = parts.reduce<{ nodes: ReactNode[]; buffer: string }>(
    (acc, part, i) => {
      const match = part.match(/^\[(\d+)\]$/);
      const label = match && sources ? sources[Number(match[1]) - 1] : undefined;
      if (!match || !label) {
        return { nodes: [...acc.nodes, <span key={i}>{part}</span>], buffer: acc.buffer + part };
      }
      const n = Number(match[1]);
      const quote = acc.buffer.trim();
      const isActive = activeReferenceIndex === n;
      const node = (
        <button
          key={i}
          type="button"
          onClick={() => onOpenReference({ index: n, label, quote })}
          className={`inline-flex items-center justify-center align-super mx-0.5 w-[16px] h-[16px] rounded text-[10px] font-bold leading-none transition-colors cursor-pointer ${
            isActive ? "bg-teal text-white" : "bg-teal-soft text-teal hover:bg-teal hover:text-white"
          }`}
          title={label}
        >
          {n}
        </button>
      );
      return { nodes: [...acc.nodes, node], buffer: "" };
    },
    { nodes: [], buffer: "" }
  );

  return <p className="font-reading text-[15px] leading-relaxed text-foreground whitespace-pre-wrap">{nodes}</p>;
}

export default function ChatWindow({ messages, subject, onSend, loading, onOpenReference, activeReferenceIndex }: ChatWindowProps) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeCommand = studyModeButtons.find((b) => input.trim().toLowerCase().startsWith(b.command));

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    onSend(trimmed);
    setInput("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }

  function fillCommand(command: string) {
    setInput(`${command} `);
    textareaRef.current?.focus();
  }

  const isEmpty = messages.length === 0 && !loading;

  return (
    <div className="flex-1 flex flex-col h-full min-w-0">
      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <div className="w-full max-w-xl mb-6 text-center sm:text-right">
            <div className="mb-2 inline-block">
              <SubjectBadge subject={subject} />
            </div>
            <p className="text-sm text-muted mt-3 font-reading">
              اسأل سؤال، أو اعمل فلاش كارد أو كويز أو امتحان تجريبي من مادة كورسك.
            </p>
          </div>
          <div className="w-full max-w-xl">
            <StudyButtons onPick={fillCommand} />
            <ChatInput
              input={input}
              setInput={setInput}
              onSubmit={handleSubmit}
              onKeyDown={handleKeyDown}
              textareaRef={textareaRef}
              placeholder={activeCommand ? topicPlaceholder : questionPlaceholder}
              loading={loading}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="border-b border-border px-6 py-2.5">
            <SubjectBadge subject={subject} />
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6">
            <div className="max-w-2xl mx-auto space-y-5">
              {messages.map((msg) => {
                if (msg.role === "user") {
                  return (
                    <div key={msg.id} className="flex justify-end">
                      <div className="max-w-[80%] rounded-lg px-3.5 py-2.5 bg-user-bubble text-user-bubble-text">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                      </div>
                    </div>
                  );
                }
                return (
                  <div key={msg.id} className="flex justify-start">
                    <div className="max-w-[90%] w-full sm:max-w-lg">
                      {msg.flashcards ? (
                        <div className="rounded-xl bg-surface border border-border-light px-4 py-3.5">
                          <FlashcardDeck deck={msg.flashcards} />
                          <SourcesCaption sources={msg.sources} />
                        </div>
                      ) : msg.quiz ? (
                        <div className="rounded-xl bg-surface border border-border-light px-4 py-3.5">
                          <QuizBlock quiz={msg.quiz} />
                          <SourcesCaption sources={msg.sources} />
                        </div>
                      ) : msg.mockExam ? (
                        <div className="rounded-xl bg-surface border border-border-light px-4 py-3.5">
                          <MockExamBlock exam={msg.mockExam} />
                          <SourcesCaption sources={msg.sources} />
                        </div>
                      ) : (
                        <div className="rounded-lg bg-surface text-foreground px-3.5 py-2.5">
                          <AnswerText
                            content={msg.content}
                            sources={msg.sources}
                            onOpenReference={onOpenReference}
                            activeReferenceIndex={activeReferenceIndex}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-surface rounded-lg px-4 py-3">
                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-1.5 bg-teal rounded-full" style={{ animation: "dot-pulse 1.4s ease-in-out infinite" }} />
                      <span className="w-1.5 h-1.5 bg-teal rounded-full" style={{ animation: "dot-pulse 1.4s ease-in-out 0.2s infinite" }} />
                      <span className="w-1.5 h-1.5 bg-teal rounded-full" style={{ animation: "dot-pulse 1.4s ease-in-out 0.4s infinite" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="border-t border-border p-3">
            <div className="max-w-2xl mx-auto">
              <StudyButtons onPick={fillCommand} />
              <ChatInput
                input={input}
                setInput={setInput}
                onSubmit={handleSubmit}
                onKeyDown={handleKeyDown}
                textareaRef={textareaRef}
                placeholder={activeCommand ? topicPlaceholder : questionPlaceholder}
                loading={loading}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StudyButtons({ onPick }: { onPick: (command: string) => void }) {
  return (
    <div className="flex items-center gap-1.5 mb-2">
      {studyModeButtons.map((b) => (
        <button
          key={b.mode}
          type="button"
          onClick={() => onPick(b.command)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12.5px] font-medium text-white bg-navy hover:opacity-90 transition-opacity cursor-pointer"
        >
          {modeIcons[b.mode]}
          {b.label}
        </button>
      ))}
    </div>
  );
}

function ChatInput({
  input,
  setInput,
  onSubmit,
  onKeyDown,
  textareaRef,
  placeholder,
  loading,
}: {
  input: string;
  setInput: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  placeholder: string;
  loading: boolean;
}) {
  return (
    <form onSubmit={onSubmit}>
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          rows={1}
          className="w-full resize-none rounded-lg border border-border bg-surface px-4 py-3 pl-11 text-sm text-foreground placeholder-muted-light focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal transition-colors"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="absolute left-2 bottom-2 p-1.5 rounded-md bg-teal text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-teal-hover transition-colors cursor-pointer"
        >
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7" />
          </svg>
        </button>
      </div>
    </form>
  );
}
