import type { StudyMode } from "@/types";

export interface StudyModeButton {
  mode: Exclude<StudyMode, "question">;
  command: string;
  label: string;
}

export const studyModeButtons: StudyModeButton[] = [
  { mode: "flashcards", command: "/flashcards", label: "فلاش كارد" },
  { mode: "quiz", command: "/quiz", label: "كويز" },
  { mode: "mockexam", command: "/mockexam", label: "امتحان تجريبي" },
];

export const topicPlaceholder = "عايز تغطي أنهي درس أو موضوع؟";
export const questionPlaceholder = "اسأل أي سؤال عن المادة دي...";

export function parseSlashCommand(input: string): { mode: StudyMode; topic: string } {
  const trimmed = input.trim();
  for (const btn of studyModeButtons) {
    if (trimmed.toLowerCase().startsWith(btn.command)) {
      return { mode: btn.mode, topic: trimmed.slice(btn.command.length).trim() };
    }
  }
  return { mode: "question", topic: trimmed };
}
