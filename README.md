# HARD Summer Genre Evolution (2015-2026)

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

- **Next.js** (App Router, TypeScript)
- **Recharts** for interactive charts
- **Tailwind CSS** for styling

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Author

Built by [Kyle Coleman](https://kylecoleman.ai)
