# HARD Summer Genre Analytics — 11 Years of Lineup Data (2015-2026)

**[View Live](https://hard-summer-genre-evolution.vercel.app)**

HARD Summer is my favorite music festival, and I've been going for years. I was curious how the music has actually changed over time — it feels different every year, but I wanted to see the data behind that feeling.

I used **Claude Code** to research every lineup from 2015 to 2026, categorize 800+ artist appearances by genre, and build an interactive visualization that makes the trends easy to see and fun to explore. Along the way I built in accuracy checks, cross-referencing artist counts and genre classifications against multiple sources to make sure the data holds up.

This project shows what I think good prompting looks like: knowing the right questions to ask, directing an AI to gather and structure real data, and shaping the output into a polished, clean UI. It was also just a fun thing to share with friends — half of them didn't realize how much the festival has changed until they saw the charts.

## The Data

- **800+ artist-genre data points** researched and categorized
- **11 years** of lineup data (2015-2026, with 2020 cancelled due to COVID-19)
- **21 genre classifications** based on each artist's primary sound
- Data pulled from official lineup announcements, press releases, and festival archives, then validated against multiple sources

## What It Shows

- **Pie charts** for each year showing genre distribution
- **Expandable genre lists** revealing every artist under each genre
- **Trend line charts** tracking how each genre's share has moved over time
- **Stacked area charts** showing full composition shifts year-over-year
- **Heat map trend table** for quick year-over-year comparison
- **Most played artists** and repeat performers across the festival's history

## Key Findings

- **House/Tech House** grew from ~25% to 40%+ of lineups, becoming the dominant sound
- **Hip-Hop/Rap** peaked around 2017-2019 (25-30%) and declined to under 5%
- **Drum & Bass** emerged strongly starting in 2022 after being virtually absent
- **Hard Techno** appeared as a new genre in 2024-2025
- **Future Bass** dominated 2015-2016 then gradually faded as tastes shifted

## Tech Stack

### Framework & Language
- **[Next.js 16](https://nextjs.org/)** — React framework using the App Router for file-based routing and server components. Pages are server-rendered by default, with client components (`"use client"`) opted in only where interactivity is needed (charts, toggles, expandable lists).
- **[TypeScript](https://www.typescriptlang.org/)** — Strict mode enabled. All data is fully typed with a `Genre` union type (21 genres), `Artist` and `YearData` interfaces, ensuring the dataset stays consistent as it grows.
- **[React 19](https://react.dev/)** — Latest React with hooks (`useState`, `useMemo`, `useCallback`) for state management. No external state library needed — the data is static and derived computations are memoized.

### Data Visualization
- **[Recharts 3](https://recharts.org/)** — Built on top of D3 and React. Used for all chart types:
  - `PieChart` with `innerRadius`/`outerRadius` for donut-style genre breakdowns, custom label rendering for percentage overlays, and click-to-expand artist lists
  - `LineChart` with hover-to-highlight, click-to-toggle, and double-click-to-isolate interactions on genre trend lines
  - `AreaChart` with `stackId` for stacked genre share visualization
  - Custom `Tooltip` components for rich hover states showing sorted genre breakdowns with color-coded dots
- **Custom heat map table** — Pure HTML/CSS table with dynamic `backgroundColor` opacity calculated from genre percentage intensity, no charting library needed

### Styling & UI
- **[Tailwind CSS 4](https://tailwindcss.com/)** — Utility-first CSS with the new PostCSS plugin (`@tailwindcss/postcss`). Dark theme built with zinc color scale. Responsive grid layouts (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) for artist cards and takeaway sections.
- **Custom animations** — `fadeIn` keyframe animation on tab switches and year changes for smooth content transitions
- **[Geist font family](https://vercel.com/font)** — Geist Sans and Geist Mono loaded via `next/font/google` with CSS variable injection for clean typography

### Data Architecture
- **Single-source dataset** (`src/data/lineups.ts`) — All 800+ artist-genre mappings stored as a typed TypeScript array. Each year entry includes location, cancellation status, and a full artist roster with genre tags. This makes the data easy to audit, update, and extend.
- **Derived computations** — Genre breakdowns, trend percentages, artist appearance counts, and "legends" rankings are all computed at render time from the source data using `useMemo`, keeping the dataset flat and the logic transparent.
- **Artist normalization** — B2B and collaborative sets (e.g., "Skrillex b2b Four Tet") are automatically split into individual artists for accurate cross-year appearance tracking via regex-based name parsing.

### Deployment
- **[Vercel](https://vercel.com/)** — Deployed with zero config. Automatic builds on push to `main`. Edge-optimized delivery with Next.js server components pre-rendered at build time.

## Author

Built by [Kyle Coleman](https://kylecoleman.ai)
