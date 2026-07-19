# Portfolio Chatbot – Build Specification

## Goal
Build a chatbot for my portfolio website that answers questions **only** about the information I provide (my skills, projects, experience, education, contact info). It must **never invent or guess** answers to questions outside this data. If a question is unrelated or unanswerable from the given data, it must clearly say so and redirect the user to ask something relevant.

---

## Core Requirement: Strict Scope Control

The single most important rule:

> **The bot must never sound confident about something it doesn't actually know.**
> If the input doesn't clearly match known data, return a fallback message — never a generic, made-up, or "sounds right" answer.

---

## Data Source

Create a single structured file (`data/portfolio.json`) containing all facts the bot is allowed to talk about. Example structure:

```json
{
  "name": "Your Name",
  "role": "Full-Stack Developer",
  "summary": "Short 2-3 line bio",
  "skills": ["JavaScript", "React", "Node.js", "MongoDB"],
  "projects": [
    {
      "name": "Project A",
      "description": "What it does",
      "tech": ["React", "Firebase"],
      "link": "https://..."
    }
  ],
  "experience": [
    {
      "company": "Company X",
      "role": "Intern",
      "duration": "Jan 2025 - Jun 2025",
      "details": "What you did"
    }
  ],
  "education": [
    { "degree": "B.Tech CSE", "institute": "XYZ University", "year": "2026" }
  ],
  "contact": {
    "email": "you@example.com",
    "linkedin": "https://linkedin.com/in/you",
    "github": "https://github.com/you"
  }
}
```

The chatbot logic must **only** use this file as its knowledge base. Nothing outside it should be treated as fact.

---

## Two Implementation Modes — Pick ONE

### Mode A: Rule-Based (No external AI API, pure JS)

- Build an **intent list** with keywords per topic (skills, projects, experience, education, contact).
- Score user input against each intent by counting matched keywords.
- Require a **minimum confidence threshold** (e.g., at least 1 strong keyword match) before returning a real answer.
- If no intent scores above the threshold, return the fallback message.
- Never use a "closest guess" fallback — an honest "I don't know" is required below threshold.

**Fallback message (exact wording to use):**
> "I don't have information about that. You can ask me about my skills, projects, experience, or how to contact me."

### Mode B: LLM-Powered (using an AI API like Claude/GPT)

- Send the `portfolio.json` data as context in the **system prompt**.
- Use this exact system prompt pattern:

```
You are a portfolio assistant for [Name]. 
You must ONLY answer using the information provided below. 
Do not use outside knowledge, do not guess, and do not make up details.

PORTFOLIO DATA:
{insert portfolio.json contents here}

RULES:
1. If the user's question can be answered using the data above, answer clearly and concisely.
2. If the question is NOT covered by the data above, respond with exactly:
   "I don't have information about that. You can ask me about my skills, projects, experience, or how to contact me."
3. Never speculate, never answer general knowledge questions, never pretend to know something not in the data.
4. Keep answers short and friendly (2-4 sentences max).
```

- This guarantees the model stays "in scope" even though it's a full LLM.

---

## Scaling Guidance (for growing the bot later)

As the portfolio grows, use this checklist to scale the chatbot without breaking scope control:

1. **More data ≠ more risk** — as long as everything stays inside `portfolio.json` (or equivalent), scope stays intact.
2. **Add new intents/topics as new JSON sections**, not as new hardcoded if/else logic.
3. **Keep the confidence threshold configurable** — expose it as a constant (`CONFIDENCE_THRESHOLD`) so it can be tuned without touching core logic.
4. **Log unmatched questions** (store them in a `logs/unanswered.json` file). Periodically review these to see what real users are asking, and add relevant data if it's a good addition.
5. **If using an LLM (Mode B):** cap `max_tokens` low (e.g., 150-200) to keep answers short and prevent rambling into off-topic territory.
6. **Add a simple UI indicator** — e.g., a small "Answers based on portfolio data only" note near the chat, to set correct user expectations.

---

## Deliverables Expected From the IDE / AI Assistant

1. `data/portfolio.json` — structured knowledge base (starter template, I will fill in real data).
2. `chatbot.js` — core logic implementing **either Mode A or Mode B** as described above.
3. `index.html` / UI component — simple chat interface (input box + message thread).
4. Fallback handling fully working and tested with at least 5 sample **out-of-scope** questions to confirm it never guesses.
5. Comments in code explaining the confidence threshold / system prompt logic so I can tune it later.

---

## Test Cases (must all pass before considering this done)

| Input | Expected Behavior |
|---|---|
| "What projects have you built?" | Real answer from `portfolio.json` |
| "What's your favorite pizza topping?" | Fallback message |
| "What is the capital of France?" | Fallback message |
| "Tell me about your React experience" | Real answer, matched to skills/experience |
| "Can you write me a poem?" | Fallback message |
| "asdkjasjd" (gibberish) | Fallback message |