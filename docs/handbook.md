# Go2Trip Developer And Agent Handbook

## Product Intent

Go2Trip helps groups plan trips together, collect flights/hotels/itinerary details, import travel data from Google/files, and split expenses fairly.

The first milestone is a durable foundation, not a throwaway prototype. Every new feature should keep the codebase easy for a human or AI agent to understand quickly.

## Architecture Rules

- Keep routes thin; put domain behavior in `src/features`.
- Keep provider SDKs and secrets in `src/server`.
- Keep browser-safe shared helpers in `src/lib`.
- Store money as integer minor units and ISO currency codes.
- Store historical FX snapshots when converting expenses.
- Every external provider must sit behind an internal adapter.
- Imported travel data must be reviewed before being saved as canonical trip data.
- Supabase RLS is the source of truth for data access.

## Domain Boundaries

- Trips own itinerary, participants, expenses, imports, and settings.
- Participants represent people on a trip; they may or may not have a linked user account yet.
- Itinerary items are canonical schedule entries.
- Import jobs are untrusted parsed input until accepted.
- Expenses store original currency and trip-display currency.
- Settlements are computed from expense shares and should be deterministic.

## AI Agent Workflow

1. Read this handbook and `docs/architecture.md`.
2. Check `docs/design-system.md` before changing UI colors, logo usage, or shared components.
3. Locate the relevant feature folder.
4. Add or update domain tests before changing shared behavior.
5. Keep provider-specific logic out of UI components.
6. Update docs or ADRs when adding a new integration, schema pattern, or architectural convention.

## Coding Conventions

- Use TypeScript strict mode.
- Prefer small pure functions for domain math.
- Use Zod at API/provider boundaries.
- Use shadcn-style components in `src/components/ui`.
- Keep UI mobile-first and responsive.
- Avoid broad refactors while implementing a feature.

## Definition Of Done

- Core logic has unit tests.
- Product flows have been manually tested in the browser.
- API/provider boundaries validate inputs and outputs.
- Supabase changes include RLS policies.
- UI works on mobile viewport.
- Documentation is updated when the mental model changes.
