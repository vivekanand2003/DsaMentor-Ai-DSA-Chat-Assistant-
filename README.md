# DsaMentor AI (DSA Chat Assistant)

DsaMentor AI is an interactive AI-powered chat assistant designed to help users learn and understand **Data Structures and Algorithms (DSA)** concepts through conversational explanations and code examples.

The assistant is powered by **Google Gemini (Generative AI)** and responds strictly to algorithm-related queries, maintaining a focused learning environment.

---

## ✨ Features

* 🤖 AI chat interface for DSA learning
* 🧠 Context-aware conversational responses
* 📘 Markdown rendering for formatted explanations & code
* ⚡ Fast responses using Gemini-2.5-Flash model
* 🎨 Modern animated UI with Tailwind + React
* 🧹 Chat history clearing
* ⏱️ Message timestamps

---

## 🧱 Tech Stack

**Frontend**

* React + TypeScript
* Vite
* Tailwind CSS
* Lucide Icons
* Framer Motion

**AI Integration**

* Google Generative AI SDK (`@google/genai`)
* Gemini-2.5-Flash model

---

## ⚙️ How It Works

1. User enters a DSA-related question.
2. Chat history + new query are sent to Gemini API.
3. System instruction restricts responses to DSA topics.
4. AI response is rendered in chat with Markdown formatting.

---

## 🔑 Environment Setup

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

---

## 🚀 Run Locally

```bash
npm install
npm run dev
```

App runs at:

```
http://localhost:3000
```

---

## 📂 Project Structure

```
algomentor-ai/
│
├── src/
│   ├── App.tsx        # Main chat UI + AI logic
│   ├── main.tsx       # React entry point
│   └── index.css      # Global styles
│
├── index.html
├── package.json
├── vite.config.ts
└── .env.example
```

---

## 🧠 AI System Behavior

The assistant follows a strict system instruction:

* Responds helpfully to DSA questions
* Rejects non-DSA queries
* Provides explanations and code examples
* Maintains instructor-style tone

---

## 👨‍💻 Contribution

**Core Logic & AI Integration:**

* Gemini API key generation
* Request/response handling
* Chat-to-AI communication logic
* System instruction design

**UI & Frontend Implementation:**

* Layout, animations, styling
* Chat interface components
* Curl/API structure scaffolding

Frontend and base implementation were assisted by **AiStudio.google.com/**, while the AI integration and functional logic were independently implemented.

---

## 📸 Screenshots

