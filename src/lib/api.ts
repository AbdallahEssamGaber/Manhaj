import type { AskRequest, AskResponse } from "@/types";

export async function askQuestion(req: AskRequest): Promise<AskResponse> {
  const res = await fetch("/api/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });

  if (!res.ok) {
    throw new Error(`Ask request failed: ${res.status}`);
  }

  return res.json();
}
