# Waterloo Engineering Myth Buster - Architecture

## 1. System Overview
The system is a Firebase-backed React web app. Students authenticate, submit building-specific myths, vote, and leave testimonials. Cloud Functions generate verdicts and maintain aggregate building stats used by charts and map views.

## 2. High-Level Components
1. Web Client (React + Tailwind)
- Submission form, myth feed, dashboard charts, map view, profile, admin tools.

2. Backend Services (Firebase)
- Firestore: source of truth for myths, users, votes, testimonials, and aggregates.
- Cloud Functions: verdict generation, voting logic, stats updates, moderation automation.
- Firebase Auth: identity and role claims.
- Firebase Hosting: frontend hosting.

3. AI Integration
- OpenAI API called from Cloud Functions only.
- Prompt built from myth text + building + program/course tags.

## 3. Data Flow
1. User submits myth with building and context.
2. Myth stored as `pending_verdict`.
3. Function triggers verdict generation and writes:
- `verdictLabel` (`LIKELY_TRUE`, `LIKELY_FALSE`, `MIXED`)
- `verdictReason`
- `confidenceScore`
4. Feed updates live via Firestore listeners.
5. Votes/testimonials trigger aggregate update function.
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

## 5. Cloud Functions
1. `onMythCreateGenerateVerdict`
- Trigger: new myth document.
- Calls OpenAI, stores verdict fields.

2. `castVote`
- Callable/HTTP endpoint.
- Enforces one vote per user per myth with transaction.

3. `addTestimonial`
- Validates content and creates testimonial.

4. `updateBuildingStats`
- Triggered on myth/vote/testimonial changes.
- Updates pre-aggregated `buildingStats` docs.

5. `moderateContent`
- Optional auto-moderation for profanity/spam.

## 6. Security Model
- Firestore rules enforce:
	- authenticated create for myths/testimonials/votes
	- vote writes only to own `userId` doc
	- no direct client write to aggregate stats
	- moderator/admin-only delete or status updates
- Cloud Functions use service account to perform trusted writes.

## 7. Performance Notes
- Use composite indexes for `buildingCode + createdAt`, `programTag + buildingCode`.
- Keep dashboard reads on aggregate docs to avoid expensive scans.
- Paginate myth feed (cursor + limit).

## 8. Deployment Topology
- Single Firebase project for MVP (dev + prod can be split later).
- Hosting serves React app.
- Functions and Firestore in same region for lower latency.

