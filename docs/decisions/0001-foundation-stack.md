# ADR 0001: Foundation Stack

## Decision

Go2Trip uses Next.js, Supabase, Vercel, Tailwind/shadcn, and a provider-neutral AI adapter starting with DeepSeek V4.

## Rationale

This combination keeps the product mobile-first, deployable, collaborative, and understandable to both developers and AI coding agents. Supabase keeps the relational trip and expense model explicit, while Next.js gives the app a strong web/PWA foundation.

## Consequences

- Supabase RLS must be maintained with every schema change.
- Google import OAuth is separate from normal Supabase sign-in.
- External AI and FX providers must remain replaceable behind adapters.
