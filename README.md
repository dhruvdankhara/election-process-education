# VoteWise: Election Process Education Platform

AI-assisted election education platform built with Next.js App Router, TypeScript, Firestore-ready repositories, Auth.js, and Google Vertex AI.

## ⚠️ The Problem
The democratic process can often seem opaque, complex, and intimidating, especially for first-time voters. Furthermore, the modern information landscape is flooded with political misinformation, making it difficult for citizens to find reliable, unbiased facts about elections, candidate histories, and voting procedures. This lack of clear, accessible information leads to voter apathy, disenfranchisement, and reduced civic participation.

## 💡 How We Solve It
VoteWise addresses these challenges by providing an interactive, AI-powered educational hub. We demystify the election process through structured learning paths, allow users to practice the act of voting in a risk-free simulation, and offer real-time fact-checking tools to combat fake news. Our conversational AI acts as a 24/7 civic educator, ensuring no question goes unanswered.

## 🌍 Real-World Impact
- **Empowered Voters**: By providing clear, personalized education, we increase voter confidence and turnout.
- **Combatting Misinformation**: The built-in misinformation detector helps citizens critically evaluate political news, fostering a more informed electorate.
- **Accessibility & Inclusion**: With multi-language support, voice preferences, and strict WCAG 2.2 accessibility compliance, the platform ensures that election education is available to everyone, regardless of background or ability.

## ✨ Features
- **Personalized Learning Journeys**: Tailored educational paths designed to teach the mechanics of the electoral process at the user's own pace.
- **Voting Simulation Flow**: An interactive, step-by-step simulation that familiarizes users with the voting booth experience, reducing anxiety for first-time voters.
- **Conversational Doubt Solver**: An AI-powered chat assistant ready to answer specific, nuanced questions about election rules and procedures.
- **Misinformation Detector**: An AI tool that cross-references user-submitted claims against verified facts to flag potential fake news.
- **Election Timeline Explorer**: Interactive chronological timelines detailing past and upcoming election events.
- **User Profile & Preferences**: Customizable settings including language preferences and text-to-speech voice options.
- **Admin Suite**: Comprehensive dashboard for managing election data, timelines, and reviewing system logs.

## 🎯 Use Cases
- **First-Time Voters**: High school students or newly naturalized citizens using the simulation and learning journeys to prepare for election day.
- **News Consumers**: Citizens pasting claims from social media into the Misinformation Detector to verify their authenticity.
- **Educators & Civic Organizations**: Teachers using the platform as an interactive syllabus for civics classes.
- **Voters with Disabilities**: Users relying on screen readers and text-to-speech capabilities to access vital voting information seamlessly.

## 💻 Technology Stack
- **Frontend & Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling & UI**: Tailwind CSS v4, shadcn/ui, Radix UI Primitives
- **Authentication**: Auth.js (NextAuth) with Google OAuth integration
- **Database & Storage**: Google Cloud Firestore (via `firebase-admin`) with an intelligent in-memory fallback
- **AI & Machine Learning**: Google GenAI (`@google/genai`) / Vertex AI for chat and misinformation detection
- **State Management**: Zustand, TanStack React Query
- **Testing**: Playwright (E2E), Jest (Unit)

## 🚀 Getting Started

### Environment Variables
Copy `.env.example` to `.env` and configure the following required values:
```env
GOOGLE_CLOUD_PROJECT_ID=
AUTH_JWT_SECRET=
GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_OAUTH_CLIENT_SECRET=
ADMIN_EMAIL_ALLOWLIST=admin@example.com
```

Optional overrides for production/customization:
- `FIRESTORE_PROJECT_ID`, `FIRESTORE_DATABASE_ID`
- `GOOGLE_CLOUD_LOCATION`, `GOOGLE_VERTEX_MODEL`
- `GOOGLE_TTS_LANGUAGE_CODE`, `GOOGLE_TTS_VOICE_NAME`

### Run Locally
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗺️ Application Architecture (Main Routes)
- **Public**: `/`, `/login`, `/register`
- **User Hub**: `/dashboard`, `/learning`, `/timeline`, `/chat`, `/simulation`, `/misinformation`, `/profile`
- **Admin Panel**: `/admin`, `/admin/elections`, `/admin/timelines`, `/admin/logs`

## 🔌 API Surface (`/api/v1`)
- **Auth**: `/auth/me`
- **Users**: `/users/me`, `/users/profile`
- **Learning Journey**: `/learning-journey`, `/learning-journey/generate`, `/learning-journey/:journeyId`
- **Progress**: `/progress`, `/progress/update`
- **Elections**: `/elections`, `/elections/:electionId`
- **Timelines**: `/timelines/:electionId`, `/timelines/:electionId/:timelineId`
- **AI**: `/ai/learning/generate`, `/ai/timeline/generate`, `/ai/chat/ask`, `/ai/misinformation/check`
- **Simulation**: `/simulation/start`, `/simulation/step`
- **Admin**: Complete management endpoints for elections, timelines, and logs
