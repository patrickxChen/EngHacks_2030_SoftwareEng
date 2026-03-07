# Waterloo Engineering Myth Buster - Implementation Plan

## 1. Project Goal
Build a web app where Waterloo Engineering students can submit and vote on building-specific myths (E7, E2, DC, etc.), view AI-assisted verdicts, read testimonials, and explore building-level stats through charts and an optional map.

## 2. Core User Stories
1. As a student, I can submit a myth and tag it with a specific building and context (program, course).
2. As a student, I can see an auto-generated verdict (`Likely True`, `Likely False`, `Mixed`) with a short, memorable reason.
3. As a student, I can upvote/downvote a myth and add a testimonial tied to a building.
4. As a student, I can filter myths by building/program/course.
5. As a student, I can view charts showing myth activity by building.
6. As a student, I can view a simple map highlighting buildings by myth density or humor score.
7. As an admin/moderator, I can remove abusive or off-topic submissions.

## 3. MVP Scope
### In scope
- Authentication (email + Google login)
- Myth submission with building selector
- Building-specific verdict generation
- Community voting + testimonials
- Dashboard charts:
	- most submitted myths per building
	- most "Likely True" myths per building
	- optional top humorous testimonials by building
- Basic moderation tools

### Out of scope (Phase 2+)
- Full campus-wide coverage outside engineering
- Native mobile app
- Advanced ML model training from scratch
- Real-time websocket features beyond Firestore listeners

## 4. Milestones
## Milestone 0 - Foundation (Day 1)
- Confirm feature requirements and building list
- Set up repo structure and branching model
- Configure Firebase project
- Define Firestore schema and security rules draft

## Milestone 1 - Auth + Submission Flow (Day 2)
- Implement auth UI and session state
- Build myth submission form:
	- myth text
	- building selector
	- course/program tags
	- optional tone (serious/funny)
- Save to Firestore

## Milestone 2 - Verdict Engine + Myth Feed (Day 3)
- Build serverless function to generate verdict from myth + context
- Add myth feed with filters (building, program, course)
- Render verdict badge + reason

## Milestone 3 - Votes + Testimonials (Day 4)
- Add upvote/downvote with duplicate vote prevention
- Add testimonial submission tied to myth and building
- Add moderation flags/report button

## Milestone 4 - Analytics Dashboard (Day 5)
- Build aggregated endpoints/queries
- Add building comparison charts (E7 vs E2 vs DC)
- Add leaderboard cards (most submitted, most true, funniest)

## Milestone 5 - Map + Polish + Demo Prep (Day 6)
- Add simple interactive building map
- Color buildings by selected metric
- Improve copywriting for memorable UW engineering tone
- QA pass, bug fixes, deployment rehearsal

## 5. Work Breakdown Structure
## Frontend Tasks
- App shell and routing (`/`, `/submit`, `/myths`, `/dashboard`, `/map`, `/admin`)
- Reusable components: `MythCard`, `VerdictBadge`, `BuildingFilter`, `TestimonialList`, `StatsPanel`
- Forms with validation and error states
- Chart components and map component

## Backend Tasks
- Firestore collections and indexes
- Cloud Functions:
	- verdict generation
	- vote handling
	- aggregate stats updates
	- moderation helpers
- Security rules and role checks

## DevOps Tasks
- CI checks (lint, tests, build)
- Environment variable management
- Staging and production deployment setup

## 6. Data and API Plan (High Level)
- `POST /myths` -> create myth with building context
- `POST /myths/{id}/generate-verdict` -> AI verdict and reason
- `POST /myths/{id}/vote` -> upvote/downvote
- `POST /myths/{id}/testimonials` -> add testimonial
- `GET /stats/buildings` -> aggregate chart data
- `GET /map/metrics?metric=submissions|truth|humor` -> map heat data

## 7. Testing Strategy
- Unit tests:
	- verdict prompt builder
	- vote logic (single vote per user)
	- aggregation calculators
- Integration tests:
	- submit -> verdict -> display pipeline
	- filters + chart consistency
- Manual exploratory tests:
	- mobile layout
	- map interactions
	- moderation flow

## 8. Risks and Mitigations
- Risk: AI verdicts become repetitive or inaccurate.
	- Mitigation: prompt templates with building/program context and confidence fallback.
- Risk: low-quality or inappropriate submissions.
	- Mitigation: report flow + moderation queue + profanity filtering.
- Risk: chart queries become slow.
	- Mitigation: pre-aggregated stats documents and scheduled recalculation.
- Risk: duplicate votes or abuse.
	- Mitigation: per-user vote docs + transaction checks + Firebase rules.

## 9. Deliverables
- Deployed web app (Firebase Hosting)
- Source code with modular structure
- Updated architecture/design/progress docs
- Demo script with UW-building examples

## 10. Definition of Done
- Users can submit building-specific myths and receive verdicts
- Testimonials and votes work with anti-duplication
- Dashboard charts and map render accurate building metrics
- Basic moderation and auth are functional
- Tests pass and app is deployed
