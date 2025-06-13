# Tiny Chat App – Fullstack

This is a fullstack mini chat application built as a live coding challenge. It allows users to send messages and receive automated replies. The project is divided into a React frontend and a NestJS backend, with optional LLM integration.

---

## 🧠 Architecture Overview

<p align="center">
  <img src="docs/architecture.png" alt="Chat App Diagram" width="700" />
</p>

---

## 📦 Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, shadcn/ui, Vite
- **Backend:** NestJS, TypeScript, ValidationPipe, DTOs, ThrottlerGuard
- **Extras:** Docker (optional), LLM Integration (Gemini or OpenAI), Rate-limiting

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### 📂 Project Structure

```
tiny-chat-app-fullstack-ai/
├── frontend/       # React app
├── backend/        # NestJS API
├── docs/           # Diagram and assets
└── README.md
```

---

### 🔧 Running the Frontend

```bash
cd frontend
npm install
npm run dev
# Runs at: http://localhost:5173
```

### ⚙️ Running the Backend

```bash
cd backend
npm install
npm nest start --watch
# API endpoint: POST http://localhost:3000/chat
```

### 📤 Payload

```json
{ "message": "Hello" }
```

### 📥 Response

```json
{ "reply": "Bot: HELLO" }
```

### 🔐 Rate Limiting

This app uses NestJS’s `ThrottlerGuard` to limit requests:

- Maximum **5 requests per minute** per IP.
- Returns `429 Too Many Requests` if exceeded.

---

## ✨ Features

✅ Text input, scrollable messages, and bot replies  
✅ "Typing..." indicator while awaiting response  
✅ Input clear, auto-scroll, error handling  
✅ DTO validation and clean API response  
🚫 No database required (in-memory)  
🚦 Built-in rate-limiting via `ThrottlerGuard`  
🧪 Type-safe communication (bonus)

---

## 🧠 LLM Integration (In progress)

You can extend this app using an LLM service like Gemini or OpenAI:

- Forward user messages to the LLM
- Use `process.env` for API keys
- Restrict replies to a specific topic (e.g., front-end testing)
- Stream responses to simulate a typing effect

### 💬 Sample Questions

- "What’s the difference between unit and integration testing?"
- "How do you mock a service in Jest?"
- "Can you explain what Cypress is used for?"

---

### 🐳 Run with Docker (Backend Only)

```bash
# From the root
docker build -t chat-backend ./backend
docker run -p 3000:3000 chat-backend
```

---

## 📄 License

MIT — free to use and modify.
