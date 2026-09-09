import { NextResponse } from "next/server";
import type { AskRequest, AskResponse } from "@/types";

// Temporary stand-in for the /rag backend: calls the LLM directly with a
// system prompt instead of retrieving real course chunks. Keeps the same
// { answer, sources } contract the frontend already expects, with the model
// asked to invent plausible-looking course material citations so the demo
// UI (reference panel, [n] markers) still has something real to point at.
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "openai/gpt-oss-120b";

function systemPrompt(subject: string): string {
  return `You are the study assistant inside Manhaj, a university course chatbot, currently helping with the subject "${subject}". Answer the student's question clearly and accurately, the way a knowledgeable teaching assistant would.

Formatting rules (follow exactly):
- Write 2-5 sentences of plain, well-explained prose.
- Support claims with inline citation markers like [1], [2] placed right after the clause they support. Reuse a marker if you cite the same source again later in the answer.
- Every marker you use must have a matching entry in "sources", numbered in the order the markers first appear (marker [1] -> sources[0], etc).
- Each "sources" entry is a short label naming exactly where in the course materials the point comes from, e.g. "Lecture 6, slide 14", "Chapter 3, slides 5-9", "Tutorial 2, Q3", "Midterm 2023, Q2", "Past Exam 2022, Q4". Invent specific, plausible lecture/chapter/exam numbers that fit a real "${subject}" course, and vary the material type across the list rather than repeating the same lecture for everything.
- Never mention that the sources are invented, that you are an AI, or that there is no real course database. Present them as the actual referenced material.
- Respond with strict JSON only, no markdown fences, no extra keys, matching exactly: {"answer": string, "sources": string[]}.`;
}

export async function POST(request: Request) {
  let body: AskRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const subject = body?.subject?.trim();
  const question = body?.question?.trim();
  if (!subject || !question) {
    return NextResponse.json({ error: "subject and question are required" }, { status: 400 });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GROQ_API_KEY is not configured" }, { status: 500 });
  }

  let groqRes: Response;
  try {
    groqRes = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: systemPrompt(subject) },
          { role: "user", content: question },
        ],
        temperature: 0.4,
        response_format: { type: "json_object" },
      }),
    });
  } catch (err) {
    console.error("Groq request failed", err);
    return NextResponse.json({ error: "Model request failed" }, { status: 502 });
  }

  if (!groqRes.ok) {
    console.error("Groq request failed", groqRes.status, await groqRes.text());
    return NextResponse.json({ error: "Model request failed" }, { status: 502 });
  }

  const data = await groqRes.json();
  const raw = data?.choices?.[0]?.message?.content;
  if (typeof raw !== "string") {
    return NextResponse.json({ error: "Empty model response" }, { status: 502 });
  }

  let parsed: { answer?: unknown; sources?: unknown };
  try {
    parsed = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Malformed model response" }, { status: 502 });
  }

  const answer = typeof parsed.answer === "string" ? parsed.answer : "";
  const sources = Array.isArray(parsed.sources) ? parsed.sources.filter((s): s is string => typeof s === "string") : [];
  if (!answer) {
    return NextResponse.json({ error: "Malformed model response" }, { status: 502 });
  }

  const result: AskResponse = { answer, sources };
  return NextResponse.json(result);
}
