# 🧩 Frontend – React + TypeScript + Vite

This project uses **React 18**, **TypeScript**, **Tailwind CSS**, and **Vite** to build a modern, fast frontend application for the chat interface.

---

## 🚀 Getting Started

### 📦 Prerequisites

- Node.js (v18+)
- npm or yarn

### 📥 Installation

```bash
cd frontend
npm install
npm run dev
```

The app will run on `http://localhost:5173/` by default.

---

## 🧪 Features

- Minimal UI: Text input, "Send" button, scrollable chat area
- Typing indicator: Shows "Typing…" while the bot responds
- Error handling: 400 (empty input) and network issues gracefully handled
- Auto-scroll to latest message
- Disable "Send" when input is empty
- Submit with **Enter** key
- Clean component state management with hooks

---

## 🧠 Tech Stack

- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**
- **Vite**

---

## ✅ Linting & ESLint Setup

You can expand the ESLint configuration for type-aware and stylistic rules:

```js
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

For React-specific rules, install:

```bash
npm install eslint-plugin-react-x eslint-plugin-react-dom --save-dev
```

And extend your config:

```js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config({
  plugins: {
    "react-x": reactX,
    "react-dom": reactDom,
  },
  rules: {
    ...reactX.configs["recommended-typescript"].rules,
    ...reactDom.configs.recommended.rules,
  },
});
```

---

## 📁 Folder Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── ChatBox.tsx
│   └── main.tsx
├── index.html
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

---

## 📄 License

This project is open-source and free to use for educational and demo purposes.
