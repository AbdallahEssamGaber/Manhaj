# University Study Chatbot (IMPACT X Hackathon)

A chatbot for university students to study their subjects, trained on real course content (slides, PDFs, past exams). Cheap alternative to certified content/tutoring. Built for the Education track (SDG 4).

## Repo Structure

```
/src, /public, package.json, etc. -> Abdallah: chat UI, sidebar by subject, auth, chat history (repo root)
/rag                               -> David: content ingestion, embeddings, retrieval, Gemini answering
README.md                          -> this file
```

The frontend lives at the repo root (deployed directly to Vercel, no subfolder). `/rag` is David's own folder. Don't edit inside the other person's area unless discussed.

## Tech Stack

- Frontend: Next.js (React)
- Auth + DB: Firebase (Auth + Firestore)
- LLM + Embeddings: Gemini API
- RAG storage/retrieval: Firestore vector search (or similar, David's call)

## Branch Strategy

- `main` -> only working, tested code. Nobody pushes directly here.
- `frontend` -> Abdallah's active branch
- `rag` -> David's active branch

Workflow:
1. Work on your own branch.
2. Push often.
3. When your piece works, open a PR into `main` (or just merge if solo).
4. Test together after every merge into `main`, not silently.

## The API Contract (this is the glue between both sides)

The frontend calls the RAG side like this:

**Request**
```json
{
  "subject": "Data Structures",
  "question": "What is a binary search tree?"
}
```

**Response**
```json
{
  "answer": "A binary search tree is a tree where each node's left child is smaller and right child is larger [1]. It's commonly used for fast lookups [2].",
  "sources": [
    {
      "id": 1,
      "document": "Lecture 4 - Trees.pdf",
      "url": "https://firebasestorage.googleapis.com/.../Lecture4-Trees.pdf",
      "location": "Slide 12",
      "excerpt": "A BST is a binary tree where left < parent < right for every node.",
      "page": 12
    },
    {
      "id": 2,
      "document": "Past Exam 2023.pdf",
      "url": "https://firebasestorage.googleapis.com/.../PastExam2023.pdf",
      "location": "Question 3",
      "excerpt": "BSTs allow O(log n) search time in balanced cases.",
      "page": 4
    }
  ]
}
```

Notes on this format:
- `answer` includes inline markers like `[1]`, `[2]` matching each source's `id`
- Each source has `document` (file name), `url` (direct link to the actual file in Firebase Storage), `location` (human-readable, e.g. slide/question number), `excerpt` (the exact text that supports the claim), and `page` (used to jump to that spot in the viewer)
- The frontend uses `id` to link a clicked `[1]` marker to the matching source object, opens the side panel with a PDF viewer pointed at `url`, and jumps to `page`

This is the only thing both sides need to agree on. Frontend doesn't care how the answer is generated. RAG side doesn't care how it's displayed.

If this contract needs to change, both people agree on it first, then update this README.

## How Abdallah Runs the Frontend

```
npm install
npm run dev
```

Runs locally, calls the RAG endpoint (real or fake) for answers.

### Before RAG is Ready

Hardcode a fake response matching the exact JSON shape above, so the UI can be built and tested without waiting.

## How David Runs the RAG Side (Python / FastAPI)

```
cd rag
python -m venv venv
source venv/bin/activate   # on Windows: venv\Scripts\activate
pip install fastapi uvicorn google-generativeai firebase-admin

uvicorn main:app --reload --port 8000
```

`main.py` should expose one endpoint:

```
POST /ask
Body: { "subject": "Data Structures", "question": "What is a BST?" }
Response: { "answer": "... [1]", "sources": [{ "id": 1, "document": "...", "location": "...", "excerpt": "...", "page": 12 }] }
```

Basic FastAPI shape:

```python
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI()

class AskRequest(BaseModel):
    subject: str
    question: str

class Source(BaseModel):
    id: int
    document: str
    location: str
    excerpt: str
    page: int

class AskResponse(BaseModel):
    answer: str
    sources: List[Source]

@app.post("/ask", response_model=AskResponse)
def ask(req: AskRequest):
    # 1. embed req.question with Gemini
    # 2. retrieve top matching chunks for req.subject from Firestore vector search
    #    each chunk should already carry its document name, page number, and location label
    # 3. call Gemini with retrieved context, instruct it to cite chunks as [1], [2] etc
    # 4. build the sources list from the chunks actually cited, matching each [n] to its id
    return {
        "answer": "A binary search tree is... [1]",
        "sources": [
            {"id": 1, "document": "Lecture 4 - Trees.pdf", "location": "Slide 12", "excerpt": "...", "page": 12}
        ]
    }
```

The frontend calls `http://localhost:8000/ask` (or the deployed URL later) with the request shape above.

## Environment Variables (don't commit these)

Create a `.env.local` in the repo root and `.env` in `/rag`:

```
GEMINI_API_KEY=...
FIREBASE_API_KEY=...
FIREBASE_PROJECT_ID=...
```

Never push real keys to GitHub. Add `.env*` to `.gitignore`.

## Merge Checklist (before demo day)

- [ ] Frontend calls the real RAG endpoint, not the fake one
- [ ] At least 2 subjects fully indexed with real content
- [ ] Full demo run-through, timed under 6 minutes
- [ ] No console errors during live demo flow
- [ ] Firebase Auth works (sign up, pick uni/subject, chat)

## Notes

- Pre-index content once, don't re-process per query (saves tokens/cost)
- Gemini is used as the core LLM + embeddings to maximize Google Technology Bonus eligibility
- Sidebar categorizes subjects; chat history carries over after sign-in
- Original document files (PDFs, slides) get uploaded to Firebase Storage during ingestion. Each indexed chunk in Firestore stores its source document's Storage `url` alongside its `page`/`location`, so the RAG response can return a direct link to the real file, not just text
