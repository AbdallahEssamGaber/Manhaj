import type { FlashcardDeck, FlashcardItem, Quiz, QuizQuestion, MockExam } from "@/types";

// Hand-authored banks for a few flagship subjects so the demo has real,
// varied content. Anything outside this list falls back to the templated
// generator below, so every subject in the curriculum stays functional.

const curatedQuiz: Record<string, QuizQuestion[]> = {
  "Data Structures": [
    {
      prompt: "In a binary search tree, where do values smaller than a node live?",
      options: ["In the left subtree", "In the right subtree", "In the root only", "They can't be smaller"],
      correctIndex: 0,
      explanation: "BSTs keep every value in the left subtree smaller than the node, and every value in the right subtree larger.",
    },
    {
      prompt: "What's the average time complexity of search in a balanced BST?",
      options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
      correctIndex: 1,
      explanation: "A balanced tree halves the search space at each step, giving O(log n) average time.",
    },
    {
      prompt: "Which structure is the backbone of a priority queue?",
      options: ["Linked list", "Heap", "Hash table", "Stack"],
      correctIndex: 1,
      explanation: "Heaps keep the min (or max) element accessible in O(1) with O(log n) insert/remove.",
    },
    {
      prompt: "What happens to an unbalanced BST when values are inserted in sorted order?",
      options: ["It stays balanced", "It degenerates into a linked list", "It becomes a heap", "It throws an error"],
      correctIndex: 1,
      explanation: "Sorted insertions give every node exactly one child, so lookups degrade to O(n).",
    },
    {
      prompt: "Which traversal visits a BST's nodes in ascending order?",
      options: ["Pre-order", "Post-order", "In-order", "Level-order"],
      correctIndex: 2,
      explanation: "In-order traversal (left, node, right) visits values in sorted order for a BST.",
    },
  ],
  "Operating Systems": [
    {
      prompt: "Which data structure does the OS use to track a process's state?",
      options: ["File Allocation Table", "Process Control Block", "Page Table", "Interrupt Vector"],
      correctIndex: 1,
      explanation: "The PCB stores the program counter, registers, and scheduling info the OS needs to context-switch a process.",
    },
    {
      prompt: "What triggers a context switch?",
      options: ["A variable going out of scope", "An interrupt or scheduling decision", "A compiler warning", "A page becoming clean"],
      correctIndex: 1,
      explanation: "Interrupts, system calls, and the scheduler's timeslice expiry are the classic triggers.",
    },
    {
      prompt: "What is thrashing?",
      options: ["A CPU overheating", "Excessive paging that stalls progress", "A deadlock between two locks", "A full disk"],
      correctIndex: 1,
      explanation: "Thrashing happens when the system spends more time swapping pages than executing.",
    },
    {
      prompt: "Which condition is NOT required for deadlock?",
      options: ["Mutual exclusion", "Hold and wait", "Preemption", "Circular wait"],
      correctIndex: 2,
      explanation: "Deadlock requires no preemption — resources can't be forcibly taken away.",
    },
    {
      prompt: "What does a semaphore's wait() operation do when the value is 0?",
      options: ["Returns immediately", "Blocks the calling process", "Increments the value", "Terminates the process"],
      correctIndex: 1,
      explanation: "wait() blocks until another process calls signal() and raises the value above 0.",
    },
  ],
  "Database Systems": [
    {
      prompt: "A table in 2NF but not 3NF has what kind of dependency?",
      options: ["Partial dependency", "Transitive dependency", "No dependency", "Circular dependency"],
      correctIndex: 1,
      explanation: "3NF removes transitive dependencies — a non-key attribute depending on another non-key attribute.",
    },
    {
      prompt: "What does BCNF strengthen compared to 3NF?",
      options: ["Nothing, they're identical", "Every determinant must be a candidate key", "Foreign keys become optional", "Tables must have one column"],
      correctIndex: 1,
      explanation: "BCNF closes the edge case 3NF misses: every determinant of a functional dependency must be a candidate key.",
    },
    {
      prompt: "Which SQL clause filters groups after aggregation?",
      options: ["WHERE", "HAVING", "GROUP BY", "ORDER BY"],
      correctIndex: 1,
      explanation: "WHERE filters rows before grouping; HAVING filters the resulting groups.",
    },
    {
      prompt: "What property guarantees a transaction is all-or-nothing?",
      options: ["Isolation", "Durability", "Atomicity", "Consistency"],
      correctIndex: 2,
      explanation: "Atomicity means a transaction's operations either all commit or all roll back.",
    },
    {
      prompt: "A foreign key enforces what kind of constraint?",
      options: ["Domain integrity", "Referential integrity", "Entity integrity", "Null constraint"],
      correctIndex: 1,
      explanation: "Foreign keys ensure a referenced row actually exists in the parent table.",
    },
  ],
  "Software Engineering": [
    {
      prompt: "In Scrum, what is a sprint retrospective for?",
      options: ["Estimating story points", "Reflecting on the last sprint to improve process", "Assigning next sprint's tasks", "Demoing to stakeholders"],
      correctIndex: 1,
      explanation: "The retrospective is where the team reflects on what went well or badly, separate from the sprint review demo.",
    },
    {
      prompt: "Which artifact represents a unit of user-facing functionality in Agile?",
      options: ["A user story", "A Gantt chart", "A UML diagram", "A build script"],
      correctIndex: 0,
      explanation: "User stories describe a feature from the user's perspective and are the base unit of Agile planning.",
    },
    {
      prompt: "What does the Single Responsibility Principle state?",
      options: ["A class should have one reason to change", "A class should do everything", "Classes should never be reused", "Every method must be static"],
      correctIndex: 0,
      explanation: "SRP keeps a class focused on one job, making it easier to change without ripple effects.",
    },
    {
      prompt: "What is the main purpose of a code review?",
      options: ["Slow down releases", "Catch bugs and share knowledge before merge", "Replace testing", "Assign blame"],
      correctIndex: 1,
      explanation: "Reviews catch issues early and spread context across the team.",
    },
    {
      prompt: "Which testing level checks that independently-working modules work together?",
      options: ["Unit testing", "Integration testing", "Acceptance testing", "Smoke testing"],
      correctIndex: 1,
      explanation: "Integration tests verify that modules that pass unit tests individually also cooperate correctly.",
    },
  ],
};

const curatedCards: Record<string, FlashcardItem[]> = {
  "Data Structures": [
    { front: "What is a binary search tree?", back: "A binary tree where every left-subtree value is smaller and every right-subtree value is larger than its parent." },
    { front: "Worst case for an unbalanced BST?", back: "O(n) — sorted-order insertion degenerates the tree into a linked list." },
    { front: "What is a heap used for?", back: "Efficiently tracking the min or max element — the backbone of priority queues and heapsort." },
    { front: "Stack vs. queue?", back: "A stack is LIFO (last in, first out); a queue is FIFO (first in, first out)." },
  ],
  "Operating Systems": [
    { front: "What is a process?", back: "An instance of a program in execution: its code, program counter, stack, data section, and heap." },
    { front: "What does the scheduler decide?", back: "Which ready process gets the CPU next, and for how long." },
    { front: "What is a deadlock?", back: "A cycle of processes each waiting on a resource held by the next, so none can proceed." },
    { front: "Paging vs. segmentation?", back: "Paging splits memory into fixed-size frames; segmentation splits it into variable-size logical units." },
  ],
  "Database Systems": [
    { front: "What is normalization?", back: "Organizing tables to reduce redundancy, usually by working through 1NF → 2NF → 3NF → BCNF." },
    { front: "What is a transitive dependency?", back: "When a non-key attribute depends on another non-key attribute, rather than the primary key directly." },
    { front: "ACID stands for?", back: "Atomicity, Consistency, Isolation, Durability — the guarantees a transaction provides." },
    { front: "Primary key vs. foreign key?", back: "A primary key uniquely identifies a row; a foreign key references a primary key in another table." },
  ],
  "Software Engineering": [
    { front: "What is Agile?", back: "An iterative approach emphasizing flexibility, collaboration, and frequent customer feedback." },
    { front: "Scrum vs. Kanban?", back: "Scrum uses fixed-length sprints with defined roles; Kanban is continuous flow visualized on a board." },
    { front: "What is technical debt?", back: "The implied cost of extra rework caused by choosing an easy fix now over a better long-term approach." },
    { front: "What is a design pattern?", back: "A reusable, named solution to a common design problem — e.g. Singleton, Observer, Factory." },
  ],
};

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const templateAnswers = [
  "the mechanism covered in this week's lecture",
  "the definition given in the course notes",
  "the process described in the assigned reading",
  "the formula introduced in this topic",
  "the concept your professor emphasized on the slide",
];

function templatedQuestion(subject: string, topic: string, n: number): QuizQuestion {
  const correct = `It refers to ${templateAnswers[n % templateAnswers.length]} for "${topic}".`;
  const distractors = [
    `It's unrelated to ${topic} and belongs to a different unit.`,
    `It's the opposite of what "${topic}" describes.`,
    `It only applies outside the scope of ${subject}.`,
  ];
  const options = shuffle([correct, ...distractors]);
  return {
    prompt: `Which statement best describes "${topic}" in ${subject}?`,
    options,
    correctIndex: options.indexOf(correct),
    explanation: `Review the section on "${topic}" in your ${subject} material — this is exactly the kind of recall question it tests.`,
  };
}

function templatedCard(subject: string, topic: string, n: number): FlashcardItem {
  const fronts = [
    `Define "${topic}".`,
    `Why does "${topic}" matter in ${subject}?`,
    `Give an example of "${topic}" in practice.`,
    `What's a common mistake with "${topic}"?`,
  ];
  return {
    front: fronts[n % fronts.length],
    back: `Pulled from your ${subject} material on "${topic}" — connect the real RAG backend to get the actual definition and source.`,
  };
}

export function generateFlashcardDeck(subject: string, topic: string, count = 6): FlashcardDeck {
  const bank = curatedCards[subject];
  const cards: FlashcardItem[] = [];
  for (let i = 0; i < count; i++) {
    cards.push(bank ? bank[i % bank.length] : templatedCard(subject, topic, i));
  }
  return { topic, cards };
}

export function generateQuiz(subject: string, topic: string, count = 5): Quiz {
  const bank = curatedQuiz[subject];
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    questions.push(bank ? bank[i % bank.length] : templatedQuestion(subject, topic, i));
  }
  return { topic, questions };
}

export function generateMockExam(subject: string, topic: string, count = 8): MockExam {
  const bank = curatedQuiz[subject];
  const questions: QuizQuestion[] = [];
  for (let i = 0; i < count; i++) {
    questions.push(bank ? bank[i % bank.length] : templatedQuestion(subject, topic, i + 5));
  }
  return { topic, durationSeconds: count * 90, questions };
}
