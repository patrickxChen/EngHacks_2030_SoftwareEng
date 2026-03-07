# Waterloo Engineering Myth Buster - Architecture

## 1. System Overview
The system is a React web app with a Vercel-hosted TypeScript API. Students authenticate, submit building-specific myths, vote, and leave testimonials. API routes generate verdicts and maintain aggregate building stats used by charts and map views.

## 2. High-Level Components
1. Web Client (React + Tailwind)
- Submission form, myth feed, dashboard charts, map view, profile, admin tools.

2. Backend Services
- Firestore: source of truth for myths, users, votes, testimonials, and aggregates.
- Vercel API routes (`api/*.ts`): verdict generation, voting logic, stats reads/updates, moderation automation.
- Firebase Auth: identity and role claims.
- Vercel: deployment target for API (and frontend when ready).

3. AI Integration
- OpenAI API called from Vercel API routes only.
- Prompt built from myth text + building + program/course tags.

## 3. Data Flow
1. User submits myth with building and context.
2. Myth stored as `pending_verdict`.
3. API triggers verdict generation and writes:
- `verdictLabel` (`LIKELY_TRUE`, `LIKELY_FALSE`, `MIXED`)
- `verdictReason`
- `confidenceScore`
4. Feed updates live via Firestore listeners.
5. Votes/testimonials trigger aggregate update handlers.
6. Dashboard and map read from precomputed aggregate docs.

## 4. Firestore Schema
## `users/{userId}`
- `displayName: string`
- `email: string`
- `program: string`
- `year: number`
- `roles: string[]` (`student`, `moderator`, `admin`)
- `createdAt: timestamp`

## `myths/{mythId}`
- `text: string`
- `buildingCode: string` (E7, E2, DC, RCH, etc.)
- `programTag: string`
- `courseTag: string`
- `tone: string` (`serious`, `funny`)
- `authorId: string`
- `status: string` (`active`, `flagged`, `removed`)
- `verdictLabel: string`
- `verdictReason: string`
- `confidenceScore: number`
- `votesUp: number`
- `votesDown: number`
- `testimonialCount: number`
- `createdAt: timestamp`
- `updatedAt: timestamp`

## `myths/{mythId}/votes/{userId}`
- `value: number` (`1` or `-1`)
- `updatedAt: timestamp`

## `myths/{mythId}/testimonials/{testimonialId}`
- `userId: string`
- `buildingCode: string`
- `text: string`
- `humorScore: number` (optional function-generated score)
- `createdAt: timestamp`

## `buildingStats/{buildingCode}`
- `submissionCount: number`
- `likelyTrueCount: number`
- `likelyFalseCount: number`
- `mixedCount: number`
- `testimonialCount: number`
- `avgHumorScore: number`
- `updatedAt: timestamp`

## `reports/{reportId}`
- `targetType: string` (`myth`, `testimonial`)
- `targetId: string`
- `reason: string`
- `reportedBy: string`
- `status: string` (`open`, `resolved`)
- `createdAt: timestamp`

## 5. API Handlers (Vercel)
1. `POST /api/myths/generate-verdict`
- Calls OpenAI and returns verdict fields.

2. `POST /api/myths/:mythId/vote`
- Enforces one vote per user per myth with Firestore transaction.

3. `POST /api/myths/:mythId/testimonials`
- Validates content and creates testimonial doc.

4. `GET /api/stats/buildings`
- Returns pre-aggregated `buildingStats` docs.

5. `POST /api/moderation/report`
- Creates moderation reports for flagged content.

## 6. Security Model
- Firestore rules enforce:
	- authenticated create for myths/testimonials/votes
	- vote writes only to own `userId` doc
	- no direct client write to aggregate stats
	- moderator/admin-only delete or status updates
- Vercel API handlers use service account credentials to perform trusted writes.

## 7. Performance Notes
- Use composite indexes for `buildingCode + createdAt`, `programTag + buildingCode`.
- Keep dashboard reads on aggregate docs to avoid expensive scans.
- Paginate myth feed (cursor + limit).

## 8. Deployment Topology
- Single Firebase project for MVP (dev + prod can be split later).
- Vercel serves API routes (and optionally frontend).
- Keep Vercel region close to Firestore region for lower latency.

