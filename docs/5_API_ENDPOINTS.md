# API endpoints

## 1. Base Configuration

### Base URL

```
/api/v1
```

### API Principles

- RESTful design
- Versioned (`v1`)
- Layered architecture (Controller → Service → Repository)
- DTO + Zod validation required for every request
- AI features exposed via separate endpoints
- Public + User + Admin scoped APIs

---

## 2. Standard Response Format

### Success Response

```json
{
  "success": true,
  "data": {},
  "message": "Optional message"
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Readable message"
  }
}
```

---

## 3. Core Utilities (Backend)

### ApiResponse Class

```tsx
class ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
```

### ApiError Class

```tsx
class ApiError extends Error {
  code: string;
  statusCode: number;
}
```

### Async Handler

```tsx
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
```

---

## 4. Authentication

### Base Path

```
/api/v1/auth
```

| Method | Endpoint | Description      | Access  |
| ------ | -------- | ---------------- | ------- |
| GET    | `/me`    | Get current user | Private |

---

## 5. User Module

### Base Path

```
/api/v1/users
```

| Method | Endpoint   | Description           |
| ------ | ---------- | --------------------- |
| GET    | `/me`      | Get user profile      |
| POST   | `/profile` | Create/update profile |
| GET    | `/profile` | Get profile           |

---

## 6. Learning Journey Module

### Base Path

```
/api/v1/learning-journey
```

| Method | Endpoint                    | Description                         |
| ------ | --------------------------- | ----------------------------------- |
| POST   | `/generate`                 | Generate + Save AI learning journey |
| GET    | `/`                         | Get all user journeys               |
| GET    | `/:journeyId`               | Get journey details                 |
| PATCH  | `/:journeyId/steps/:stepId` | Mark step complete                  |

---

## 7. Progress Tracking

### Base Path

```
/api/v1/progress
```

| Method | Endpoint  | Description     |
| ------ | --------- | --------------- |
| GET    | `/`       | Get progress    |
| POST   | `/update` | Update progress |

---

## 8. Elections (Public + User)

### Base Path

```
/api/v1/elections
```

| Method | Endpoint       | Description          | Access |
| ------ | -------------- | -------------------- | ------ |
| GET    | `/`            | Get all elections    | Public |
| GET    | `/:electionId` | Get election details | Public |

---

## 9. Timeline Module

### Base Path

```
/api/v1/timelines
```

| Method | Endpoint                   | Description           | Access |
| ------ | -------------------------- | --------------------- | ------ |
| GET    | `/:electionId`             | Get election timeline | Public |
| GET    | `/:electionId/:timelineId` | Get timeline details  | Public |

---

## 10. AI Module

### Base Path

```
/api/v1/ai
```

---

### 10.1 Learning AI

| Method | Endpoint             | Description                             |
| ------ | -------------------- | --------------------------------------- |
| POST   | `/learning/generate` | Generate personalized journey (no save) |

---

### 10.2 Timeline AI

| Method | Endpoint             | Description                  |
| ------ | -------------------- | ---------------------------- |
| POST   | `/timeline/generate` | Generate simplified timeline |

---

### 10.3 Chat AI

| Method | Endpoint    | Description                          |
| ------ | ----------- | ------------------------------------ |
| POST   | `/chat/ask` | Ask question (session-based context) |

### Request Example

```json
{
  "message": "Can I vote if I moved?",
  "context": [{ "role": "user", "message": "Previous question" }]
}
```

---

### 10.4 Misinformation Detector

| Method | Endpoint                | Description                 |
| ------ | ----------------------- | --------------------------- |
| POST   | `/misinformation/check` | Verify content authenticity |

---

## 11. Simulation Module

### Base Path

```
/api/v1/simulation
```

| Method | Endpoint | Description            |
| ------ | -------- | ---------------------- |
| POST   | `/start` | Start simulation       |
| POST   | `/step`  | Submit simulation step |

> Note: No data stored (stateless)

---

## 12. Admin Module

### Base Path

```
/api/v1/admin
```

---

### 12.1 Elections

| Method | Endpoint         | Description     |
| ------ | ---------------- | --------------- |
| POST   | `/elections`     | Create election |
| PATCH  | `/elections/:id` | Update election |
| DELETE | `/elections/:id` | Delete election |

---

### 12.2 Timelines

| Method | Endpoint                                 | Description     |
| ------ | ---------------------------------------- | --------------- |
| POST   | `/timelines/:electionId`                 | Create timeline |
| POST   | `/timelines/:timelineId/events`          | Add event       |
| PATCH  | `/timelines/:timelineId/events/:eventId` | Update event    |
| DELETE | `/timelines/:timelineId/events/:eventId` | Delete event    |

---

### 12.3 Admin Logs

| Method | Endpoint | Description             |
| ------ | -------- | ----------------------- |
| GET    | `/logs`  | Get admin activity logs |

---

## 13. Middleware & Security

### Authentication Middleware

- Validate session (NextAuth)
- Attach user to request

### Authorization Middleware

- Role-based access:
  - `user`
  - `admin`

---

## 14. Validation Rules

- All inputs validated using Zod
- DTO required before service layer
- Reject invalid requests early

---

## 15. Error Handling Strategy

- Centralized error handler
- Use `ApiError`
- Return consistent error response

---

## 16. Naming Conventions

- REST nouns (no verbs)
- kebab-case routes
- clear hierarchy

Examples:

```
/learning-journey
/learning-journey/:id
/admin/timelines/:id/events
```

---

## 17. API Flow Example

### Learning Journey Creation

```
POST /api/v1/learning-journey/generate
```

Flow:

```
Controller
   ↓
Validate DTO (Zod)
   ↓
Service (AI call + business logic)
   ↓
Repository (Firestore save)
   ↓
Response
```

---

## 18. Notes

- Chat & Simulation are stateless (no DB)
- AI endpoints are separate for scalability
- Public APIs available for election awareness
- Designed for OpenAPI documentation

---

## Summary

- Clear separation (user / admin / public)
- AI-first architecture
- Scalable module-based endpoints
- Production-grade error + response handling
- Clean integration with Firestore + Next.js
