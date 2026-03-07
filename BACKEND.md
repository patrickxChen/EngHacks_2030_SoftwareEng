# Backend Scaffold (Vercel + TypeScript)

## Stack
- Vercel Serverless Functions in `api/`
- Firestore + Firebase Auth (via `firebase-admin`)
- OpenAI for verdict generation
- Zod for request validation

## Implemented Route Stubs
- `GET /api/health`
- `POST /api/myths/generate-verdict`
- `POST /api/myths/:mythId/vote`
- `POST /api/myths/:mythId/testimonials`
- `GET /api/stats/buildings`
- `POST /api/moderation/report`

## Local Setup
1. Install dependencies:
   - `npm install`
2. Configure env vars from `.env.example`.
3. Run local API dev server:
   - `npm run dev`
4. Run tests:
   - `npm test`

## Notes
- All routes currently enforce bearer auth, unless `ALLOW_UNAUTHENTICATED_LOCAL=true`.
- `generate-verdict` has a fallback response when no `OPENAI_API_KEY` is present.
- Firestore rules/indexes are still managed via `firestore.rules` and `firestore.indexes.json`.
