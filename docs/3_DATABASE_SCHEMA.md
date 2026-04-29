# Database Schema (Firestore)

## Overview

- Database: Firestore
- Structure: Nested subcollections

---

## 1. users

### users/{userId}

| Field     | Type                |
| --------- | ------------------- |
| id        | string              |
| name      | string              |
| email     | string              |
| avatar    | string              |
| role      | string (user/admin) |
| createdAt | timestamp           |
| updatedAt | timestamp           |

---

### users/{userId}/profile/{profileId}

| Field             | Type                            |
| ----------------- | ------------------------------- |
| age               | number                          |
| isFirstTimeVoter  | boolean                         |
| location          | object { country, state, city } |
| preferredLanguage | string                          |
| voiceEnabled      | boolean                         |

---

### users/{userId}/learningJourney/{journeyId}

| Field       | Type      |
| ----------- | --------- |
| title       | string    |
| description | string    |
| difficulty  | string    |
| createdAt   | timestamp |
| updatedAt   | timestamp |

---

### users/{userId}/learningJourney/{journeyId}/steps/{stepId}

| Field       | Type      |
| ----------- | --------- |
| title       | string    |
| description | string    |
| order       | number    |
| isCompleted | boolean   |
| completedAt | timestamp |

---

### users/{userId}/progress/{progressId}

| Field          | Type      |
| -------------- | --------- |
| journeyId      | string    |
| completedSteps | number    |
| totalSteps     | number    |
| percentage     | number    |
| lastAccessedAt | timestamp |

---

## 2. elections

### elections/{electionId}

| Field       | Type      |
| ----------- | --------- |
| title       | string    |
| country     | string    |
| state       | string    |
| type        | string    |
| description | string    |
| createdBy   | string    |
| createdAt   | timestamp |
| updatedAt   | timestamp |

---

### elections/{electionId}/timelines/{timelineId}

| Field       | Type      |
| ----------- | --------- |
| title       | string    |
| description | string    |
| isDummy     | boolean   |
| createdBy   | string    |
| createdAt   | timestamp |

---

### elections/{electionId}/timelines/{timelineId}/events/{eventId}

| Field       | Type      |
| ----------- | --------- |
| title       | string    |
| description | string    |
| date        | timestamp |
| type        | string    |
| importance  | string    |

---

## 3. admin

### admin/{adminId}

| Field     | Type      |
| --------- | --------- |
| name      | string    |
| email     | string    |
| role      | string    |
| createdAt | timestamp |

---

### admin/{adminId}/actionsLog/{logId}

| Field      | Type      |
| ---------- | --------- |
| action     | string    |
| targetId   | string    |
| targetType | string    |
| timestamp  | timestamp |

---

## Not Stored

- Chat history
- Simulation data
- Voice/audio files
- Misinformation queries
