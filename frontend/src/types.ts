export type StudyMode = "question" | "flashcards" | "quiz" | "mockexam";

export interface Reference {
  /** 1-based marker index as it appears inline in the answer, e.g. [1] */
  index: number;
  /** Human-readable source label, e.g. "Lecture 4, slide 12" */
  label: string;
  /** The clause/sentence in the answer this reference was attached to */
  quote: string;
}

export interface FlashcardItem {
  front: string;
  back: string;
}

export interface QuizQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface FlashcardDeck {
  topic: string;
  cards: FlashcardItem[];
}

export interface Quiz {
  topic: string;
  questions: QuizQuestion[];
}

export interface MockExam {
  topic: string;
  durationSeconds: number;
  questions: QuizQuestion[];
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: string[];
  references?: Reference[];
  mode?: StudyMode;
  flashcards?: FlashcardDeck;
  quiz?: Quiz;
  mockExam?: MockExam;
  timestamp: number;
}

export interface Chat {
  id: string;
  subject: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface Subject {
  id: string;
  name: string;
  /** Two-letter monogram shown in the subject badge, no emoji */
  monogram: string;
}

export interface Major {
  id: string;
  name: string;
  /** Total length of the program in years */
  years: number;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  bg: string;
  text: string;
  majors: Major[];
}

export interface StudyProfile {
  universityId: string;
  majorId: string;
  year: number;
}

export interface AskRequest {
  subject: string;
  question: string;
}

export interface AskResponse {
  answer: string;
  sources: string[];
}
