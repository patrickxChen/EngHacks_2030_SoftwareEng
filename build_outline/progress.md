# Waterloo Engineering Myth Buster - Progress Tracker

## Current Status
- Phase: Backend Scaffolded
- Overall completion: 45%
- Last updated: 2026-03-07

## Milestone Status
1. Foundation and setup - Completed
2. Auth and submission flow - In Progress
3. Verdict engine and myth feed - In Progress
4. Votes and testimonials - In Progress
5. Analytics dashboard - Not Started
6. Map and polish - Not Started

## Completed
- Established product concept and UW-engineering-specific direction.
- Wrote implementation plan.
- Defined architecture, schema, and function responsibilities.
- Defined UI/UX design system and page-level behavior.
- Added Vercel backend scaffold with modular API routes.
- Implemented `POST /api/myths` creation flow with verdict persistence.
- Hardened Firestore rules for myth schema and immutable ownership fields.

## In Progress
- Implementing remaining backend endpoint logic and role checks.

## Next Up
- Add endpoint-level tests for `POST /api/myths` (auth + write + verdict path).
- Finalize vote/testimonial integration checks with Firestore rules.
- Implement building stats aggregation update logic.

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

