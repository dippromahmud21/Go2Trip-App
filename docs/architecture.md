# Architecture

## Application

Go2Trip uses Next.js App Router as the web application shell. Product functionality is grouped by domain under `src/features`, while server-only integrations live under `src/server`.

## Data

Supabase Postgres stores canonical trip data. Realtime subscriptions will power collaborative updates, and row-level security controls access for every trip-scoped table.

## Authentication

Supabase Auth handles normal app sign-in, including email/password and Google sign-in. Google import OAuth is separate because it requests Gmail and Calendar read-only scopes.

## Imports

Import sources include Gmail, Google Calendar, PDFs, screenshots, and pasted text. Import jobs produce parsed payloads that must be reviewed before creating flights, hotel stays, or itinerary items.

## AI

The app calls a `TravelAiProvider` interface. DeepSeek V4 is the first implementation, using `deepseek-v4-flash` by default and `deepseek-v4-pro` for harder normalization tasks.

## Offline

The PWA foundation starts with installability and cache-aware architecture. Feature-level offline sync should be added with an explicit local queue and conflict policy when trip editing screens are implemented.
