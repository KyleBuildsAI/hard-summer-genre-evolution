# HARD Summer Genre Evolution (2015-2026)

Interactive data visualization tracking how music genres have shifted at the HARD Summer music festival in Los Angeles across 11 years of lineups.

## What It Shows

- **Pie charts** for each year showing genre distribution (genre count / total artists)
- **Expandable genre lists** revealing every artist categorized under that genre
- **Heat map trend table** showing how each genre's share has changed year-over-year
- Covers **2015-2026** (2020 cancelled due to COVID-19)
- Includes **800+ unique artist-genre data points** compiled from official lineup announcements

## Key Insights

- **House/Tech House** has grown from ~25% to 40%+ of lineups
- **Hip-Hop/Rap** peaked around 2017-2019 (25-30%) and has declined
- **Drum & Bass** emerged strongly starting in 2022
- **Hard Techno** appeared as a new genre starting in 2024-2025
- **Hyperpop** had a brief moment in 2022 and returned in 2026
- **Future Bass** dominated 2015-2016 then gradually faded

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Recharts** for interactive pie charts
- **Tailwind CSS** for styling
- **Vercel** for deployment

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Data Sources

Artist lineups sourced from:
- Official HARD Summer website (hardsummer.com)
- EDM Identity, Billboard, Clashfinder, setlist.fm
- Festival announcement press releases

Genre classifications are based on each artist's primary/most recognized genre.

## Deploy

```bash
npm run build
```

Deploy to Vercel with one click or via the Vercel CLI.

## Author

Built by [Kyle Coleman](https://kylecoleman.ai)
