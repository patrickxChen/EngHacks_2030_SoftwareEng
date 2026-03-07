# Waterloo Engineering Myth Buster - Progress Tracker

## Current Status
- Phase: Backend Scaffolded
- Overall completion: 35%
- Last updated: 2026-03-07

## Milestone Status
1. Foundation and setup - Completed
2. Auth and submission flow - Not Started
3. Verdict engine and myth feed - Not Started
4. Votes and testimonials - Not Started
5. Analytics dashboard - Not Started
6. Map and polish - Not Started

## Completed
- Established product concept and UW-engineering-specific direction.
- Wrote implementation plan.
- Defined architecture, schema, and function responsibilities.
- Defined UI/UX design system and page-level behavior.

## In Progress
- Implementing backend endpoint logic on top of scaffolded routes.

## Next Up
- Implement auth and myth submission flow first.
- Set up Firestore collections and indexes.
- Add `POST /api/myths` creation endpoint with verdict persistence.

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
- [ ] Myth submit + verdict integration
- [ ] Voting + testimonials
- [ ] Dashboard charts
- [ ] Map view
- [ ] Moderation and rules hardening
- [ ] Deployment

