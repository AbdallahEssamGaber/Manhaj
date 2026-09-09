# University Study Chatbot (IMPACT X Hackathon)

A chatbot for university students to study their subjects, trained on real course content (slides, PDFs, past exams). Cheap alternative to certified content/tutoring. Built for the Education track (SDG 4).

## Repo Structure

```
/frontend    -> Abdallah: chat UI, sidebar by subject, Firebase Auth, chat history
/rag         -> David: content ingestion, embeddings, retrieval, Gemini answering
README.md    -> this file
```

Two folders, two owners. Don't edit inside the other person's folder unless discussed.

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
  "answer": "A binary search tree is...",
  "sources": ["Lecture 4 slide 12", "Past exam 2023 Q3"]
}
```

This is the only thing both sides need to agree on. Frontend doesn't care how the answer is generated. RAG side doesn't care how it's displayed.

If this contract needs to change, both people agree on it first, then update this README.

## How Abdallah Runs the Frontend

```
cd frontend
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
Response: { "answer": "...", "sources": ["..."] }
```

Basic FastAPI shape:

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class AskRequest(BaseModel):
    subject: str
    question: str

@app.post("/ask")
def ask(req: AskRequest):
    # 1. embed req.question with Gemini
    # 2. retrieve top matching chunks for req.subject from Firestore vector search
    # 3. call Gemini with retrieved context to generate the answer
    # 4. return answer + sources
    return {"answer": "...", "sources": ["..."]}
```

The frontend calls `http://localhost:8000/ask` (or the deployed URL later) with the request shape above.

## Environment Variables (don't commit these)

Create a `.env.local` in `/frontend` and `.env` in `/rag`:

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
