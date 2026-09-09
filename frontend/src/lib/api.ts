import type { AskRequest, AskResponse } from "@/types";

const RAG_URL = process.env.NEXT_PUBLIC_RAG_URL || "http://localhost:8000";
const USE_FAKE = process.env.NEXT_PUBLIC_USE_FAKE_RAG !== "false";

// Fake answers include inline [n] reference markers so the reference panel
// has real demo data to point at, matching the shape a real RAG backend
// would return: { answer, sources }.
const fakeResponses: Record<string, AskResponse> = {
  "Data Structures": {
    answer:
      "A binary search tree (BST) is a binary tree where each node has at most two children[1]. For every node, all values in the left subtree are smaller and all values in the right subtree are larger[1]. This property enables efficient searching, insertion, and deletion with O(log n) average time complexity[2].",
    sources: ["Lecture 4, slide 12", "Past exam 2023, Q3"],
  },
  "Operating Systems": {
    answer:
      "A process is an instance of a program in execution[1]. It includes the program code, current activity, stack, data section, and heap. The OS manages processes through creation, scheduling, and termination using a Process Control Block (PCB) to track each process's state[2].",
    sources: ["Chapter 3, slides 1-15", "Midterm 2022, Q1"],
  },
  "Database Systems": {
    answer:
      "Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity[1]. The most common normal forms are 1NF, 2NF, and 3NF[1]. BCNF is a stricter version of 3NF[2].",
    sources: ["Lecture 7, slides 20-35", "Tutorial 4, Q2"],
  },
  "Software Engineering": {
    answer:
      "Agile is an iterative approach to software development that emphasizes flexibility, collaboration, and customer feedback[1]. Key practices include sprints, daily standups, user stories, and retrospectives[2]. Popular frameworks include Scrum and Kanban.",
    sources: ["Chapter 2, slides 5-18", "Past exam 2024, Q5"],
  },
};

export async function askQuestion(req: AskRequest): Promise<AskResponse> {
  if (USE_FAKE) {
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 600));
    const fake = fakeResponses[req.subject];
    if (fake) return fake;
    return {
      answer: `This is a placeholder answer about "${req.question}" for ${req.subject}[1]. Connect the real RAG backend to get actual answers grounded in your course materials.`,
      sources: ["Placeholder source"],
    };
  }

  const res = await fetch(`${RAG_URL}/ask`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    throw new Error(`RAG request failed: ${res.status}`);
  }

  return res.json();
}
