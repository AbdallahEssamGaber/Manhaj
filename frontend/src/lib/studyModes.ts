import type { StudyMode } from "@/types";

export interface StudyModeButton {
  mode: Exclude<StudyMode, "question">;
  command: string;
  label: string;
}

export const studyModeButtons: StudyModeButton[] = [
  { mode: "flashcards", command: "/flashcards", label: "Flashcards" },
  { mode: "quiz", command: "/quiz", label: "Quiz" },
  { mode: "mockexam", command: "/mockexam", label: "Mock Exam" },
];

export const topicPlaceholder = "Which lesson or topic should this cover?";
export const questionPlaceholder = "Ask anything about this course...";

export function parseSlashCommand(input: string): { mode: StudyMode; topic: string } {
  const trimmed = input.trim();
  for (const btn of studyModeButtons) {
    if (trimmed.toLowerCase().startsWith(btn.command)) {
      return { mode: btn.mode, topic: trimmed.slice(btn.command.length).trim() };
    }
  }
  return { mode: "question", topic: trimmed };
}
