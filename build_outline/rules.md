# Engineering Rules

1. Always read `build_outline/architecture.md` and `build_outline/rules.md` before implementing features.
2. Keep code modular. Prefer feature folders and reusable components/functions instead of monolithic files.
3. Update `build_outline/architecture.md` when schema, API shape, or service boundaries change.
4. Update `build_outline/progress.md` after each milestone or major feature.
5. Every myth feature must preserve building context (`buildingCode`) across UI, API, and data storage.
6. All privileged logic (verdict generation, aggregate updates, moderation actions) must run in Cloud Functions, not client code.
7. Enforce least privilege with Firebase rules. Clients must never write aggregate stats directly.
8. Require input validation for myth submission, testimonials, and votes.
9. Add tests for business logic changes (vote handling, verdict mapping, stats aggregation).
10. Use short-lived branches and frequent commits with clear messages.

## Naming Conventions
- Collections: plural lower camel case (`buildingStats`, `reports`).
- Fields: lower camel case (`buildingCode`, `confidenceScore`).
- UI components: PascalCase (`MythCard.tsx`).

## Definition of Ready (Task)
- Acceptance criteria defined.
- Data impact identified.
- Security/rules impact identified.

## Definition of Done (Feature)
- Feature works on desktop and mobile.
- Security rules updated if needed.
- Tests added or updated.
- Build outline docs updated.
