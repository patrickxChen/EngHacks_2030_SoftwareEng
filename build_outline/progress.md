# Waterloo Engineering Myth Buster - Progress Tracker

## Current Status
- Phase: Frontend-Backend Integration
- Overall completion: 60%
- Last updated: 2026-03-07

## Milestone Status
1. Foundation and setup - Completed
2. Auth and submission flow - In Progress
3. Verdict engine and myth feed - In Progress
4. Votes and testimonials - In Progress
5. Analytics dashboard - In Progress
6. Map and polish - In Progress

## Completed
- Established product concept and UW-engineering-specific direction.
- Wrote implementation plan.
- Defined architecture, schema, and function responsibilities.
- Defined UI/UX design system and page-level behavior.
- Added Vercel backend scaffold with modular API routes.
- Implemented `POST /api/myths` creation flow with verdict persistence.
- Hardened Firestore rules for myth schema and immutable ownership fields.
- Merged frontend branch into backend integration branch.
- Wired frontend myths feed, submit flow, results search, dashboard, and map to backend API endpoints.
- Added `GET /api/myths` feed endpoint to support frontend filtering/search.

## In Progress
- Stabilizing frontend auth-to-backend auth token flow.
- Finalizing moderation and profile endpoints for non-mock admin/home drawer sections.

## Next Up
- Commit integration changes and push `backend` branch.
- Replace localStorage-only login with Firebase Auth token wiring.
- Implement moderation queue backend endpoints used by admin page.

## Risks Log
- AI output quality may vary by prompt quality.
- Data model may need index tuning once real traffic appears.
- Building map data source might require manual coordinates.

## Decision Log
- Chosen architecture: React + Firestore/Auth + OpenAI in Vercel API routes.
- Chosen data model: myths-centered schema with building aggregates.
- Chosen UX focus: building-first navigation and comparatives.

## Tracking Checklist
- [x] Problem framing
- [x] Feature scope definition
- [x] Architecture draft
- [x] Implementation plan draft
- [x] Project scaffold
- [ ] Auth implementation
- [x] Myth submit + verdict integration
- [ ] Voting + testimonials
- [ ] Dashboard charts
- [ ] Map view
- [x] Moderation and rules hardening
- [ ] Deployment

