# Project File Structure

## 1. Root Level

```
/project-root
│── src/
│── public/
│── docs/
│── tests/
│── scripts/
│── next.config.ts
│── package.json
│── tsconfig.json
│── middleware.ts
```

---

## 2. `/src` (Main Application)

```
/src
│── app/                    # Next.js App Router
│── components/             # Reusable UI components
│── modules/                # Feature-based + layered architecture
│── core/                   # Shared core logic (db, utils, configs)
│── hooks/                  # Custom hooks
│── types/                  # Global types
│── styles/
```

---

## 3. `/src/app` (Routing Layer)

```
/src/app
│── layout.tsx
│── page.tsx
│── globals.css

│── (auth)/
│   ├── login/page.tsx
│   ├── register/page.tsx

│── dashboard/
│── learning/
│── timeline/
│── simulation/
│── chat/
│── admin/
```

---

## 4. `/src/modules` (Core Architecture)

> Each feature follows **clean layered architecture**

```
/src/modules

│── auth/
│── user/
│── learning-journey/
│── timeline/
│── chat/
│── simulation/
│── misinformation/
│── election/
│── admin/
```

---

## 5. Module Structure (IMPORTANT)

Each module follows this:

```
/module-name

│── controller/             # API handlers / server actions
│   ├── *.controller.ts

│── service/                # Business logic
│   ├── *.service.ts

│── repository/             # Firestore queries
│   ├── *.repository.ts

│── dto/                    # Data Transfer Objects
│   ├── create-*.dto.ts
│   ├── update-*.dto.ts
│   ├── response-*.dto.ts

│── validation/             # Zod schemas
│   ├── *.schema.ts

│── ai/                     # AI-specific logic (if needed)
│   ├── prompts.ts
│   ├── parser.ts

│── types.ts                # Local types
│── constants.ts
│── index.ts
```

---

## 6. Example: `learning-journey` Module

```
/learning-journey

│── controller/
│   ├── learning.controller.ts

│── service/
│   ├── create-journey.service.ts
│   ├── get-journey.service.ts

│── repository/
│   ├── learning.repository.ts

│── dto/
│   ├── create-journey.dto.ts
│   ├── journey-response.dto.ts

│── validation/
│   ├── journey.schema.ts

│── ai/
│   ├── generate-journey.prompt.ts
│   ├── journey.parser.ts
```

---

## 7. `/src/core` (Shared Infrastructure)

```
/src/core

│── database/
│   ├── firestore.client.ts     # Firestore init
│   ├── base.repository.ts      # Common DB methods

│── services/
│   ├── ai/
│   │   ├── vertex.service.ts
│   │   ├── prompt-builder.ts
│   │   ├── response-parser.ts
│   │
│   ├── speech/
│   │   ├── tts.service.ts
│   │   ├── stt.service.ts
│   │
│   ├── translation/
│   │   ├── translate.service.ts

│── auth/
│   ├── auth.config.ts
│   ├── auth.service.ts

│── utils/
│   ├── logger.ts
│   ├── helpers.ts
│   ├── date.ts

│── constants/
│── config/
│   ├── env.ts
```

---

## 8. `/src/components`

```
/src/components
│── ui/                 # shadcn
│── shared/
│── layout/
│── charts/
│── loaders/
```

---

## 9. `/src/hooks`

```
/src/hooks
│── useAuth.ts
│── useUser.ts
│── useLearningJourney.ts
│── useTimeline.ts
│── useChat.ts
```

---

## 10. `/src/types`

```
/src/types
│── global.types.ts
│── api.types.ts
```

---

## 11. `/tests`

```
/tests
│── unit/
│── integration/
│── e2e/
```

---

## 12. Architecture Flow (VERY IMPORTANT)

```
UI (app/)
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
Firestore
```

---

## 13. Layer Responsibilities

### Controller

- Handles request/response
- Calls service
- No business logic

### Service

- Core business logic
- Calls repository + AI services

### Repository

- Only DB queries
- No business logic

### DTO

- Structured input/output
- Strict typing

### Validation

- Zod schemas
- Validate DTO before service

---

## 14. Firestore Mapping

Based on schema :

- users → user.repository.ts
- learningJourney → learning-journey.repository.ts
- elections → election.repository.ts
- timelines → timeline.repository.ts
- admin logs → admin.repository.ts

---

## 15. AI Layer Mapping

Based on features :

- learning AI → learning-journey/ai
- timeline AI → timeline/ai
- chat AI → chat/ai
- misinformation → misinformation/ai

---

## 16. Best Practices

### 1. Strict Layer Separation

- ❌ No DB in service
- ❌ No logic in controller
- ❌ No API in components

### 2. DTO First Approach

- Always define DTO before service

### 3. Repository Reusability

- Common queries → base.repository.ts

### 4. AI Isolation

- Keep prompts separate

### 5. No Direct Firestore in UI

- Always go through layers

---

## 17. Naming Conventions

- `create-user.service.ts`
- `user.repository.ts`
- `create-user.dto.ts`
- `user.schema.ts`

---

## 18. What NOT to Do

- ❌ Mixing service + repository
- ❌ Skipping validation
- ❌ Using any type
- ❌ Large single service files
- ❌ Business logic in React components

---

## Summary

This structure gives:

- Clean architecture (service + repository + DTO)
- Scalable feature modules
- AI-ready separation
- Firestore-friendly design
- Production-grade maintainability
