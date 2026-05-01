# VoteWise - Project Context

## Project Overview

VoteWise is a production-grade election process education platform. It aims to help citizens understand elections, verify political information, and prepare for voting through interactive simulations and AI-assisted personalized learning.

**Main Technologies:**

- **Frontend & API:** Next.js 16 (App Router), React 19, TypeScript
- **Styling & UI:** Tailwind CSS v4, shadcn/ui, Radix UI Primitives, base-ui
- **State Management:** Zustand (client state), TanStack React Query (server state caching)
- **Database & Storage:** Google Cloud Firestore (`firebase-admin`) with an in-memory fallback mechanism.
- **Authentication:** Auth.js (NextAuth v5 beta), Google OAuth, JWT with role-based access control (RBAC).
- **AI & Cloud Services:** Google Vertex AI (Gemini 2.5 Flash via `@google/genai`), Google Cloud Text-to-Speech, Google Analytics Data API (GA4), Google Maps JS API.

**Architecture:**

- The project follows a Next.js App Router architecture.
- Core modules are separated into logical directories under `src/modules` (e.g., admin, election, learning-journey) and `src/core` (auth, database, services).
- Interactions with AI and Databases are abstracted behind repository and service patterns.
- Protected routes (like `/admin`) and actions validate roles using JWT claims and server-side middleware.

## Building and Running

**Prerequisites:** Node.js 20+, npm 10+, and a Google Cloud Project with Firestore enabled.
Make sure environment variables are configured (see `.env.example`).

- **Install Dependencies:** `npm install`
- **Run Development Server:** `npm run dev` (Runs on http://localhost:3000)
- **Build Production Bundle:** `npm run build`
- **Start Production Server:** `npm run start`

## Testing Commands

- **Unit Tests (Jest):** `npm run test:unit`
- **End-to-End Tests (Playwright):**
  - Run all headless: `npm run test:e2e` or `npm run test`
  - Run headed (visible browser): `npm run test:e2e:headed`
  - Interactive UI mode: `npm run test:e2e:ui`
  - Debug mode: `npm run test:e2e:debug`
  - Show HTML Report: `npm run test:e2e:report`

## Development Conventions

- **Language:** TypeScript is strictly used throughout the project.
- **Validation:** Zod schemas are used extensively to validate API payloads, environment variables, and forms (using `react-hook-form`).
- **Styling:** Tailwind CSS is the standard. UI components are built with Radix and shadcn.
- **Code Formatting & Linting:** Enforced via `npm run format` (Prettier) and `npm run lint` (ESLint).
- **Accessibility:** UI must be WCAG 2.2-compliant. The project uses `axe-core` to validate accessibility across core routes. Text-to-speech functionality should be considered for civic announcements.
- **E2E Testing Pattern:** E2E tests are structured using the Page Object Model (POM) pattern located in `tests/pages/`. Network tests that rely on external dependencies (like Vertex AI, TTS, Auth) should use deterministic API mocking to prevent flaky tests.
- **Error Handling:** Use safe fallback responses when cloud resources (like Vertex AI or Firestore) are degraded or unavailable (e.g., in-memory repository fallbacks for local dev).
