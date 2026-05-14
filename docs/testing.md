# Testing Strategy

## Unit Tests

Use Vitest for pure domain behavior:

- Expense splitting
- Settlement minimization
- Currency conversion
- Import normalization
- Permission helpers

## Integration Tests

Add integration tests when the relevant flows become stable enough to protect:

- Supabase auth session handling
- Trip invitation flow
- Google OAuth callback boundaries
- AI parser contracts

## Manual Product QA

For now, Go2Trip uses manual browser testing for product flows. This keeps the early product loop lightweight while screens and workflows are still changing quickly.

Manually verify:

- Sign up/sign in
- Create trip
- Invite participant
- Add itinerary item
- Add expense and view settlement
- Import review from mocked Google/file data

Reintroduce automated browser tests after the core trip, participant, itinerary, and expense flows have stabilized.
