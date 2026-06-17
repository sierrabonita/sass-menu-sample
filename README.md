# saas-menu-sample

A SaaS-style text editor application featuring a Notion-like AI assistant menu, triggered by text selection with real-time streaming responses.

🌍 **Live Demo:** https://sass-menu-sample.vercel.app/

## 🤖 Harness Engineering (AI Governance)
- **AI Agent Guardrails:** AGENTS.md (Context provisioning and coding rules for AI assistants)
- **Prompt Engineering:** PROMPTS.md (Historical log of prompts used to generate and debug code)

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Package Manager:** npm
- **Runtime:** Node.js

## 📦 Libraries & Core APIs (Application Logic)

- **AI Integration:** Vercel AI SDK (`ai`, `@ai-sdk/google`(`gemini-2.5-flash`))

## 🎨 UI & Design

- **Styling:** Tailwind CSS

## ⚙️ Tooling & Quality

- **Linting:** ESLint (Next.js default)

## 📋 Commit Message Format

|Prefix||
|---|---|
|feat|A new feature
|fix|A bug fix|
|docs|Documentation only changes|
|style|Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)|
|refactor|A code change that neither fixes a bug nor adds a feature|
|perf|A code change that improves performance|
|test|Adding missing or correcting existing tests|
|chore|Changes to the build process or auxiliary tools and libraries such as documentation generation|
