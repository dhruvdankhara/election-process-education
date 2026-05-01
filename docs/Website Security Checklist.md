# Next.js Code Quality Checklist (Production-Ready)

## 1. Project Structure

Keep a scalable folder structure.

Example:

```txt
src/
 ├── app/
 ├── components/
 │    ├── ui/
 │    ├── common/
 │    └── features/
 ├── lib/
 ├── services/
 ├── hooks/
 ├── store/
 ├── types/
 ├── utils/
 ├── validations/
 ├── constants/
 └── middleware.ts
```

Important:

- Separate UI, business logic, and API logic.
- Avoid huge files.
- Use feature-based structure for large apps.

---

# 2. TypeScript Quality

Use strict TypeScript.

```json
{
  "strict": true
}
```

Important rules:

- Avoid `any`
- Create reusable types/interfaces
- Type API responses
- Type props properly
- Use enums/constants for fixed values

Bad:

```ts
const user: any = data;
```

Good:

```ts
interface User {
  id: string;
  name: string;
}
```

---

# 3. ESLint + Prettier

Must use:

- ESLint
- Prettier
- Husky
- lint-staged

Install:

```bash
npm install -D eslint prettier husky lint-staged
```

Purpose:

- Auto format code
- Prevent bad patterns
- Maintain consistency

Important ESLint rules:

- no-unused-vars
- no-console (production)
- import/order
- react-hooks/exhaustive-deps

---

# 4. Component Architecture

## Keep Components Small

Bad:

- 1000+ line component

Good:

- Split:
  - UI
  - hooks
  - forms
  - modals
  - tables

---

## Reusable Components

Create reusable:

- Button
- Modal
- Input
- Dialog
- Table
- Pagination
- Loader

Using:

- shadcn/ui
- Tailwind CSS

---

# 5. Server vs Client Components

Use Server Components by default.

Use `"use client"` only when needed.

Use client component for:

- state
- event handlers
- browser APIs

Benefits:

- Better performance
- Smaller JS bundle
- Faster loading

---

# 6. API Layer Architecture

Do not directly call fetch everywhere.

Create service layer.

Bad:

```ts
const data = await fetch("/api/users");
```

Good:

```ts
services / user.service.ts;
```

Example:

```ts
export const getUsers = async () => {
  return api.get("/users");
};
```

Benefits:

- Reusable
- Easier testing
- Cleaner code

---

# 7. Validation

Always validate:

- Forms
- API inputs
- Environment variables

Recommended:

- Zod
- React Hook Form

Example:

```ts
const schema = z.object({
  email: z.string().email(),
});
```

---

# 8. Error Handling

Never expose raw errors.

Use:

- try/catch
- error boundaries
- centralized error handling

Good:

```ts
try {
  ...
} catch (error) {
  logger.error(error);
  throw new Error("Something went wrong");
}
```

---

# 9. Logging

Use proper logging.

Avoid:

```ts
console.log();
```

Use:

- Pino
- Winston

Separate:

- info
- warning
- error

---

# 10. Environment Variables

Validate env variables at startup.

Example:

```ts
DATABASE_URL=
JWT_SECRET=
NEXT_PUBLIC_API_URL=
```

Never:

- hardcode secrets
- expose private env to frontend

Use:

```env
NEXT_PUBLIC_
```

only for frontend-safe variables.

---

# 11. Authentication & Security

Important:

- HttpOnly cookies
- CSRF protection
- Rate limiting
- Input sanitization
- XSS prevention
- Secure headers
- RBAC/permissions

Recommended:

- NextAuth.js
- middleware protection

---

# 12. Performance Optimization

Important:

- Use dynamic imports
- Image optimization
- Pagination
- Lazy loading
- Memoization when needed
- Cache properly

Use:

- `next/image`
- `next/font`

Avoid:

- unnecessary re-renders

---

# 13. Data Fetching Best Practices

Use:

- Server Actions
- Server Components
- React Query (if needed)

Recommended:

- TanStack Query for client caching

---

# 14. Database Practices

Important:

- Indexing
- Pagination
- Validation
- Transactions
- Soft delete if needed

Never:

- trust frontend validation only

Recommended ORM:

- Prisma

---

# 15. State Management

Do not overuse global state.

Use:

- local state first
- context if small
- global store only when necessary

Recommended:

- Zustand
- Redux Toolkit for large apps

---

# 16. Accessibility (A11y)

Important:

- semantic HTML
- keyboard navigation
- aria-labels
- color contrast
- focus states

Test with:

- Lighthouse
- axe DevTools

---

# 17. Testing

## Unit Testing

Use:

- Jest
- Vitest

Test:

- utility functions
- hooks
- services

---

## Component Testing

Use:

- React Testing Library

---

## E2E Testing

Use:

- Playwright
- Cypress

Test:

- login
- checkout
- forms
- critical flows

---

# 18. Git & CI/CD

Important:

- Feature branches
- Pull request reviews
- Commit conventions
- CI checks

CI should run:

- lint
- type check
- tests
- build

Recommended:

- GitHub Actions

---

# 19. Code Review Standards

Before merge check:

- readability
- duplication
- security
- performance
- edge cases
- accessibility
- responsiveness

---

# 20. Production Monitoring

Use:

- error tracking
- analytics
- uptime monitoring

Recommended:

- Sentry
- Vercel Analytics

---

# 21. Documentation

Maintain:

- README
- API docs
- setup guide
- environment setup
- architecture notes

New developer should understand project quickly.

---

# 22. Production Readiness Checklist

Before deployment:

- ESLint passes
- TypeScript passes
- No console logs
- Environment validated
- Loading states added
- Error states added
- Mobile responsive
- Accessibility checked
- SEO checked
- API protected
- Rate limiting added
- Images optimized
- Proper caching
- Build successful
- Lighthouse tested

---

# Recommended Stack for High-Quality Next.js Apps

## Frontend

- Next.js
- Tailwind CSS
- shadcn/ui

## Validation

- Zod
- React Hook Form

## State

- Zustand

## Database

- Prisma

## Testing

- Jest
- Playwright

## Monitoring

- Sentry

## Deployment

- Vercel
