# EngBusters

EngBusters is a hackathon project for Waterloo Engineering students to crowd-test campus myths.
Users can submit claims, vote `True/False`, add comments, and explore trending myths by course, professor, or building.

## Why This Exists

Campus rumor cycles are fast, messy, and usually unverifiable.
EngBusters turns rumor sharing into a lightweight, structured fact-check loop:

- Submit a myth tied to a real context (course/prof/building)
- Vote with the crowd signal (`True` or `False`)
- Add comments/testimonials with lived experience
- Surface trends so students can make better decisions faster

## Hackathon Value

- Social utility: Helps students separate noise from useful signal.
- Fast feedback loop: Crowd input appears immediately in discussions.
- Demo-ready UX: Splash screen, protected app flow, and focused pages.
- Full-stack execution: React frontend + serverless backend + Firestore + OpenAI integration.

## Core Features

- Splash entry at `/` with branded EngBusters experience.
- Auth-gated app flow with UW email login pattern.
- Daily Digest dashboard for trending myth views.
- Search page with filtering by tags and categories.
- Myth discussion pages (`/myth/:mythId`) with:
	- vote widget (`True/False`)
	- threaded comments/testimonials
	- contextual tags (course/prof/building)
- Submit flow for creating new myths.
- Building-level stats endpoint for analytics use.

## Tech Stack

- Frontend: React, TypeScript, Vite, React Router, Recharts, Framer Motion
- Backend: Vercel Serverless Functions, TypeScript, Zod
- Data/Auth: Firestore via `firebase-admin`
- AI: OpenAI API for verdict generation fallback/augmentation

## Architecture (High Level)

1. Frontend calls `/api/*` routes via `frontend/src/lib/api.ts`.
2. API routes validate payloads with Zod.
3. Auth user identity is resolved in backend helper logic.
4. Firestore stores myths, votes, testimonials, and reports.
5. Verdict generation can call OpenAI (with fallback behavior).

## Repository Structure

```text
api/                      # Vercel serverless API routes
frontend/                 # React client app
build_outline/            # Planning docs and implementation notes
firestore.rules           # Firestore security rules
firestore.indexes.json    # Firestore indexes
vercel.json               # Vercel function configuration
```

## API Endpoints

- `GET /api/health`
- `GET /api/myths`
- `POST /api/myths`
- `POST /api/myths/generate-verdict`
- `POST /api/myths/:mythId/vote`
- `POST /api/myths/:mythId/testimonials`
- `GET /api/stats/buildings`
- `POST /api/moderation/report`

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and set:

- `FIREBASE_SERVICE_ACCOUNT_JSON`
- `FIREBASE_PROJECT_ID`
- `OPENAI_API_KEY`
- `ALLOW_UNAUTHENTICATED_LOCAL`

Optional frontend env:

- `VITE_API_BASE_URL` (if frontend should call a non-default backend origin)

### 3. Run frontend

```bash
npm --prefix frontend run dev
```

### 4. Run backend

```bash
npm run dev
```

### 5. Build frontend

```bash
npm --prefix frontend run build
```

### 6. Typecheck and test backend

```bash
npm run typecheck
npm test
```




