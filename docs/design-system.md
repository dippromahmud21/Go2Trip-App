# Design System

## Brand

Go2Trip uses the uploaded logo as the primary brand asset. The visual identity is energetic and consumer-friendly, built around travel orange and collaborative purple.

## Assets

- Primary logo: `public/brand/go2trip-logo.png`
- Use the full logo in headers, landing moments, and auth surfaces.
- Use text-only labels only when the full logo would be too small to read.

## Color Tokens

- Primary purple: `hsl(var(--brand-purple))`
- Deep purple: `hsl(var(--brand-purple-deep))`
- Travel orange: `hsl(var(--brand-orange))`
- Soft orange background: `hsl(var(--brand-orange-soft))`
- App background: `hsl(var(--background))`
- Surface: `hsl(var(--surface))`

## Typography

- Title font: Gloock
- Body font: Inter
- Use Gloock only for expressive page titles, hero titles, and compact feature headings.
- Use Inter for body copy, navigation, buttons, forms, captions, metadata, and dense UI.
- Title utilities:
  - `text-title-xl` for the home hero title
  - `text-title-lg` for future section heroes
  - `text-title-md` for page titles
  - `font-display` for small branded headings
- Body utilities:
  - `font-sans` for default UI text
  - `text-body-lg` for prominent supporting copy
  - `text-ui-label` for small uppercase labels

## UI Direction

- Polished consumer travel app, not enterprise dashboard.
- Mobile-first layouts with clear actions and compact cards.
- Orange is for emphasis and forward motion.
- Purple is for primary structure, brand, and collaboration.
- Keep rounded corners at `8px` or less unless an asset itself is circular.
