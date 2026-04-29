# VoteWise Guide

AI-assisted election education platform built with Next.js App Router, TypeScript, Firestore-ready repositories, and Auth.js.

## Core capabilities

- Personalized learning journeys
- Election timeline explorer
- Conversational doubt solver
- Voting simulation flow
- Misinformation detector
- User profile + preferences (language, voice)
- Admin suite for elections, timelines, and logs

## Tech stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS + shadcn/ui
- Auth.js (Google OAuth)
- Firestore repositories with in-memory fallback

## Environment variables

Copy `.env.example` to `.env` and set required values:

- `GOOGLE_CLOUD_PROJECT_ID`
- `AUTH_JWT_SECRET`
- `GOOGLE_OAUTH_CLIENT_ID`
- `GOOGLE_OAUTH_CLIENT_SECRET`
- `ADMIN_EMAIL_ALLOWLIST` (comma-separated emails promoted to admin role)

Optional overrides:

- `FIRESTORE_PROJECT_ID`, `FIRESTORE_DATABASE_ID`
- `GOOGLE_CLOUD_LOCATION`, `GOOGLE_VERTEX_MODEL`
- `GOOGLE_TTS_LANGUAGE_CODE`, `GOOGLE_TTS_VOICE_NAME`

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Main routes

### Public

- `/`
- `/login`
- `/register`

### User

- `/dashboard`
- `/learning`
- `/timeline`
- `/chat`
- `/simulation`
- `/misinformation`
- `/profile`

### Admin

- `/admin`
- `/admin/elections`
- `/admin/timelines`
- `/admin/logs`

## API surface (`/api/v1`)

- Auth: `/auth/me`
- Users: `/users/me`, `/users/profile`
- Learning journey: `/learning-journey`, `/learning-journey/generate`, `/learning-journey/:journeyId`, `/learning-journey/:journeyId/steps/:stepId`
- Progress: `/progress`, `/progress/update`
- Elections: `/elections`, `/elections/:electionId`
- Timelines: `/timelines/:electionId`, `/timelines/:electionId/:timelineId`
- AI: `/ai/learning/generate`, `/ai/timeline/generate`, `/ai/chat/ask`, `/ai/misinformation/check`
- Simulation: `/simulation/start`, `/simulation/step`
- Admin: `/admin/elections`, `/admin/elections/:id`, `/admin/timelines/:electionId`, `/admin/timelines/:timelineId/events`, `/admin/timelines/:timelineId/events/:eventId`, `/admin/logs`
