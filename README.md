# Go2Trip

Go2Trip is a mobile-first web app for collaborative trip planning, travel import, and shared expense settlement.

## Stack

- Next.js App Router + TypeScript
- Tailwind CSS + shadcn/ui conventions
- Supabase Auth, Postgres, Realtime, Storage, and RLS
- Vercel deployment
- DeepSeek V4 behind a provider-neutral AI import adapter
- Vitest and Playwright

## Local Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create environment variables:

   ```bash
   cp .env.example .env.local
   ```

3. Fill in Supabase, DeepSeek, and Google OAuth values in `.env.local`.

4. Start the app:

   ```bash
   ./scripts/dev.sh
   ```

5. Run checks:

   ```bash
   pnpm typecheck
   pnpm test
   ```

## Project Map

- `src/app` contains routes, layouts, and API route handlers.
- `src/features` contains product domains such as trips, itinerary, expenses, imports, and currencies.
- `src/lib` contains shared app infrastructure.
- `src/server` contains server-only integrations and providers.
- `supabase/migrations` contains database schema, RLS policies, and future migrations.
- `docs` contains the project handbook, architecture notes, roadmap, and decision records.
- `public/brand` contains app brand assets.

Start with `docs/handbook.md` before adding features.
