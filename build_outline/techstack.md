# Tech Stack

## Frontend
- React + TypeScript
	- Component-driven UI for myths, testimonials, charts, and map views.
- Vite
	- Fast local development and build pipeline.
- Tailwind CSS
	- Utility-first styling and consistent design tokens.
- React Router
	- Routes for `home`, `submit`, `myths`, `dashboard`, `map`, `admin`.
- Recharts
	- Building-level analytics charts.
- Framer Motion (optional)
	- Lightweight entrance and verdict animations.

## Backend
- Firebase Authentication
	- Email/password and Google sign-in.
- Cloud Firestore
	- Stores users, myths, votes, testimonials, reports, and building aggregates.
- Vercel Serverless Functions (TypeScript API routes)
	- Generates AI verdicts.
	- Enforces vote integrity.
	- Maintains aggregate stats for charts/map.
	- Handles moderation workflows.
- Vercel
	- Hosts API routes and can host frontend when ready.

## AI Layer
- OpenAI API via Vercel API routes
	- Building-aware verdict generation with concise reasoning.
	- Optional humor scoring for testimonials.

## Quality and Tooling
- ESLint + Prettier
	- Consistent style and safer code changes.
- Vitest + React Testing Library
	- Unit/component tests.
- Firebase Emulator Suite
	- Local auth/firestore development and testing.
- Vercel CLI
	- Local execution of API routes (`vercel dev`).
- GitHub Actions
	- CI: lint, test, build on pull request.

## Suggested Package Groups
- Frontend: `react`, `react-dom`, `react-router-dom`, `recharts`, `framer-motion`, `zod`
- Backend: `firebase-admin`, `openai`, `zod`, `@vercel/node`
- Tooling: `typescript`, `eslint`, `prettier`, `vitest`, `@testing-library/react`

## Why This Stack
- Fast MVP iteration for hackathon constraints.
- Managed infrastructure reduces ops overhead.
- Easy path from prototype to production with minimal rewrites.
