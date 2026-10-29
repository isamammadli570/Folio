# Folio — Kitab Evi

A portfolio e-commerce site for the classics of philosophy, history, psychology and literature: sixty books, forty-five
authors, three languages (Azerbaijani, English, Russian), in a dark "museum hall" design.

## Features

- **Author spotlight** — marble busts, a half-circle with an engraving from each author's world, the author's words in the
  original language with a translation.
- **Catalogue** — search across all three languages, filters (section, period, price, stock) kept in the URL, sorting.
- **Book page** — a 3D book whose thickness follows the page count, a timeline of the work and the author's life, a
  sticky buy bar.
- **Author page** — life in figures, works on the timeline, contemporaries whose lives overlapped.
- **Favourites** — the saved books standing as spines on a shelf, with the shelf's value and the centuries it spans.
- **Cart and checkout** — fly-to-cart animation, free-delivery progress, a three-step demo checkout with validation.
- **Everywhere** — an animated logo, scroll reveals from a single IntersectionObserver, transform/opacity-only animation,
  "reduce motion" respected, a NextCook-style sidebar on phones, Ctrl K search.

## Stack

Vite · React 19 · TypeScript (strict) · Tailwind CSS 4 · TanStack Query · React Router 7 · react-hook-form · i18next ·
Radix UI · Vitest.

Data is local for now (`src/data`), served through an API layer (`src/api`) that returns promises, so the next phase can
switch it to Supabase without touching the pages.

## Run

```bash
npm install
npm run dev
```

```bash
npm run build      # type-check and production build into dist/
npm run test:run   # unit tests
npm run lint
```

## Roadmap

1. ✅ Front end with local data
2. Supabase: database, auth, orders, storage
3. Admin panel

## Image credits

- Author busts are AI-generated.
- The engravings and paintings in the author half-circles are public-domain works from Wikimedia Commons.
- This is a portfolio project: orders are not real and no payment is taken.
