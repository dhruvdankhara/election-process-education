# Website design and pages

## 1. Design Philosophy

### Core Goal

Build a **simple, guided, and interactive platform** to help users understand the election process clearly and progressively.

### Principles

- **Clarity over complexity**
- **Guided experience (step-by-step learning)**
- **AI-first interaction model**
- **Accessible (multilingual + voice)**
- **Minimal cognitive load**
- **Trustworthy and educational**

---

## 2. Design System

### UI Library

- **shadcn/ui (fixed)**

### Styling

- Tailwind CSS (utility-first)
- Consistent spacing scale
- Neutral color base + accent for actions

### Components Strategy

- Reusable UI from `components/ui`
- Shared components from `components/shared`
- Feature-specific components inside modules

### Design Tokens

- Typography:
  - Heading: Clear, bold
  - Body: Readable, medium size
- Colors:
  - Primary → Action / CTA
  - Secondary → Supporting UI
  - Muted → Background / inactive
- States:
  - Success, Error, Warning clearly distinguishable

---

## 3. Layout Structure

### Global Layout

- Navbar (top)
- Main content area
- Optional sidebar (dashboard/admin)
- Footer (minimal)

### Navigation Type

- Public navigation (unauthenticated)
- Authenticated navigation (dashboard-driven)
- Admin navigation (separate access)

---

## 4. User Roles

### 1. Guest (Unauthenticated)

- View public election info
- Explore limited features

### 2. User

- Personalized learning journey
- Timeline access
- Chat, simulation, AI tools

### 3. Admin

- Manage elections
- Manage timelines
- Monitor system activity

---

## 5. Pages & Content

---

## 5.1 Public Pages

### 1. Home Page `/`

**Purpose:** Entry point + overview

**Content:**

- Platform introduction
- Key features overview:
  - Learning journey
  - Timeline
  - Chat assistant
  - Simulation
  - Misinformation detector
- Call-to-action (Get Started / Login)
- Supported languages / voice capability

---

### 2. Login Page `/login`

**Content:**

- Google OAuth login

---

### 3. Register Page `/register`

**Content:**

- Basic user onboarding inputs:
  - Age
  - First-time voter status
  - Location
  - Preferred language
  - Voice preference

---

## 5.2 User Pages

---

### 4. Dashboard `/dashboard`

**Purpose:** Central hub

**Content:**

- User profile summary
- Learning progress overview
- Current learning journey
- Upcoming election timelines
- Quick access:
  - Continue learning
  - Open chat
  - Start simulation
  - Check misinformation

---

### 5. Learning Journey `/learning`

**Content:**

- List of user learning journeys
- Selected journey details:
  - Title
  - Description
  - Difficulty
- Steps list:
  - Step title
  - Step description
  - Completion status

(Driven by AI personalization)

---

### 6. Timeline `/timeline`

**Content:**

- List of elections
- Selected election timeline:
  - Timeline title
  - Description
- Timeline events:
  - Event title
  - Description
  - Date
  - Importance

---

### 7. Chat Assistant `/chat`

**Content:**

- Chat interface
- User queries
- AI responses
- Context-aware conversation

---

### 8. Simulation `/simulation`

**Content:**

- Simulation steps:
  - Identity verification
  - Voting process
  - Vote submission
- Step instructions
- Feedback from AI

---

### 9. Misinformation Detector `/misinformation`

**Content:**

- Input field (user content)
- AI verification result:
  - True / False / Uncertain
- Explanation of result

---

### 10. Profile Page `/profile`

**Content:**

- User info:
  - Name
  - Email
  - Avatar
- Profile details:
  - Age
  - Location
  - Preferences
- Settings:
  - Language
  - Voice enable/disable

---

## 5.3 Admin Pages

---

### 11. Admin Dashboard `/admin`

**Content:**

- Overview:
  - Total users
  - Total elections
  - Activity logs summary

---

### 12. Manage Elections `/admin/elections`

**Content:**

- List of elections
- Election details:
  - Title
  - Type
  - Location
  - Description

---

### 13. Manage Timelines `/admin/timelines`

**Content:**

- Timeline list per election
- Timeline details
- Events:
  - Title
  - Description
  - Date
  - Importance
  - Dummy/real indicator

---

### 14. Admin Logs `/admin/logs`

**Content:**

- Action logs:
  - Action type
  - Target (election/timeline)
  - Timestamp

---

## 6. Feature Mapping to Pages

| Feature                 | Page              |
| ----------------------- | ----------------- |
| Learning Journey        | `/learning`       |
| Timeline Generator      | `/timeline`       |
| Chat AI                 | `/chat`           |
| Simulation              | `/simulation`     |
| Misinformation Detector | `/misinformation` |
| Progress Tracking       | `/dashboard`      |

---

## 7. Content Strategy

### Content Types

- Educational (learning steps)
- Informational (timeline events)
- Interactive (chat, simulation)
- Analytical (misinformation results)

### Content Source

- AI-generated (learning, explanations)
- Admin-managed (elections, timelines)
- User-generated input (chat, misinformation)

---

## 8. Accessibility & Localization

### Supported Features

- Multilingual support
- Voice interaction (TTS/STT)
- Simple language explanations

---

## 9. State & Data Flow (UI Perspective)

- Server-driven data (Next.js + APIs)
- User-specific personalization
- Stateless modules:
  - Chat
  - Simulation

---

## 10. Design Constraints

- No data persistence for:
  - Chat
  - Simulation
  - Voice data
- AI-heavy features must remain:
  - Fast
  - Context-aware
  - Reliable

---

## 11. Summary

This design ensures:

- Clear user journey from beginner → informed voter
- Strong separation of public, user, and admin flows
- AI-first experience across learning, chat, and verification
- Scalable and maintainable structure aligned with your architecture
