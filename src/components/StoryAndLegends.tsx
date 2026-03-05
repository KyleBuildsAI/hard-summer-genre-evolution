"use client";

import { useMemo } from "react";
import { lineupData, GENRE_COLORS, Genre } from "@/data/lineups";

interface ArtistAppearance {
  name: string;
  years: number[];
  count: number;
  genres: Genre[];
  primaryGenre: Genre;
}

function normalizeArtistName(raw: string): string[] {
  const names: string[] = [];
  const b2bMatch = raw.match(/^(.+?)\s+b2b\s+(.+)$/i);
  if (b2bMatch) {
    names.push(b2bMatch[1].trim(), b2bMatch[2].trim());
  }
  const xMatch = raw.match(/^(.+?)\s+x\s+(.+)$/i);
  if (xMatch && !b2bMatch) {
    names.push(xMatch[1].trim(), xMatch[2].trim());
  }
  if (names.length === 0) {
    let cleaned = raw
      .replace(/\s*\(.*?\)\s*/g, "")
      .replace(/\s*presents?\s+.*/i, "")
      .replace(/:\s+.*$/, "")
      .trim();
    if (cleaned.length > 0) names.push(cleaned);
  }
  return names;
}

function computeArtistAppearances(): ArtistAppearance[] {
  const artistMap = new Map<
    string,
    { years: Set<number>; genres: Genre[] }
  >();

  for (const yd of lineupData) {
    if (yd.cancelled) continue;
    for (const artist of yd.artists) {
      const names = normalizeArtistName(artist.name);
      for (const name of names) {
        const key = name.toLowerCase();
        if (!artistMap.has(key)) {
          artistMap.set(key, { years: new Set(), genres: [] });
        }
        const entry = artistMap.get(key)!;
        entry.years.add(yd.year);
        entry.genres.push(artist.genre);
      }
    }
  }

  const appearances: ArtistAppearance[] = [];
  for (const [, value] of artistMap) {
    const yearsArr = Array.from(value.years).sort();
    const genreCount = new Map<Genre, number>();
    for (const g of value.genres) {
      genreCount.set(g, (genreCount.get(g) || 0) + 1);
    }
    let primaryGenre: Genre = value.genres[0];
    let maxCount = 0;
    for (const [g, c] of genreCount) {
      if (c > maxCount) {
        maxCount = c;
        primaryGenre = g;
      }
    }

    const displayName =
      value.genres.length > 0
        ? findDisplayName(yearsArr, Array.from(genreCount.keys())[0])
        : "";

    appearances.push({
      name: displayName,
      years: yearsArr,
      count: yearsArr.length,
      genres: Array.from(genreCount.keys()),
      primaryGenre,
    });
  }

  appearances.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  return appearances;
}

function findDisplayName(years: number[], _genre: Genre): string {
  for (const yd of lineupData) {
    if (years.includes(yd.year)) {
      for (const a of yd.artists) {
        const names = normalizeArtistName(a.name);
        if (names.length === 1) return names[0];
      }
    }
  }
  return "";
}

function computeAppearancesClean(): ArtistAppearance[] {
  const artistMap = new Map<
    string,
    { displayName: string; years: Set<number>; genres: Genre[] }
  >();

  for (const yd of lineupData) {
    if (yd.cancelled) continue;
    for (const artist of yd.artists) {
      const names = normalizeArtistName(artist.name);
      for (const name of names) {
        const key = name.toLowerCase();
        if (!artistMap.has(key)) {
          artistMap.set(key, {
            displayName: name,
            years: new Set(),
            genres: [],
          });
        }
        const entry = artistMap.get(key)!;
        entry.years.add(yd.year);
        entry.genres.push(artist.genre);
      }
    }
  }

  const appearances: ArtistAppearance[] = [];
  for (const [, value] of artistMap) {
    const yearsArr = Array.from(value.years).sort();
    const genreCount = new Map<Genre, number>();
    for (const g of value.genres) {
      genreCount.set(g, (genreCount.get(g) || 0) + 1);
    }
    let primaryGenre: Genre = value.genres[0];
    let maxCount = 0;
    for (const [g, c] of genreCount) {
      if (c > maxCount) {
        maxCount = c;
        primaryGenre = g;
      }
    }

    appearances.push({
      name: value.displayName,
      years: yearsArr,
      count: yearsArr.length,
      genres: Array.from(genreCount.keys()),
      primaryGenre,
    });
  }

  appearances.sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  return appearances;
}

export default function StoryAndLegends() {
  const appearances = useMemo(() => computeAppearancesClean(), []);
  const legends = appearances.filter((a) => a.count >= 3);
  const top5 = appearances.slice(0, 5);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Divider */}
      <div className="w-16 h-px bg-zinc-700 mx-auto my-12" />

      {/* Story Section */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white text-center mb-2">
          The Story of HARD Summer
        </h2>
        <p className="text-sm text-zinc-500 text-center mb-8">
          A decade of evolution, told through its lineups
        </p>

        <div className="max-w-3xl mx-auto space-y-5 text-zinc-300 text-sm leading-relaxed">
          <p>
            Looking at HARD Summer 2026, it&apos;s hard to believe this is the same
            festival that booked Ice Cube and Major Lazer as headliners just ten
            years ago. The transformation is dramatic and deliberate: what was once
            a scrappy crossover event blending hip-hop heavyweights with EDM
            trap bangers has become one of the West Coast&apos;s premier electronic
            music destinations, with a sound palette that now stretches from
            Berlin-grade techno to UK garage to Latin-infused house.
          </p>

          <p>
            <span className="text-white font-semibold">The early years (2015-2017)</span>{" "}
            were defined by the collision of hip-hop and electronic music. Lineups
            featured The Weeknd alongside The Chemical Brothers, Schoolboy Q next
            to Porter Robinson, Snoop Dogg sharing a bill with Justice and
            Bassnectar. Hip-hop acts made up 20-30% of each lineup, and trap
            music&mdash;the genre bridging both worlds&mdash;was king. Future bass
            artists like San Holo, Louis The Child, and Odesza represented the
            melodic side, while the Dirtybird crew (Claude VonStroke, Justin
            Martin) held it down for house music purists in the back stages.
          </p>

          <p>
            <span className="text-white font-semibold">The pivot began around 2018-2019.</span>{" "}
            Travis Scott and Kid Cudi still headlined, and rappers like Juice WRLD,
            Jack Harlow, and Saweetie were rising stars on the undercard. But behind
            the scenes, tech house was quietly taking over. Fisher&apos;s breakout in
            2018 signaled a seismic shift. Dom Dolla, Noizu, and VNSSA appeared for
            the first time in 2019. The Dirtybird stage was no longer a niche&mdash;it
            was becoming the main event.
          </p>

          <p>
            <span className="text-white font-semibold">Post-COVID (2021-2022)</span>{" "}
            accelerated everything. When the festival returned, the bass music scene
            had exploded (Subtronics, Svdden Death, Virtual Riot), and for the first
            time, drum &amp; bass acts like Sub Focus, Dimension, and Nia Archives
            earned slots. Megan Thee Stallion and Lil Uzi Vert headlined 2022, but
            the ratio had flipped: electronic acts now dominated 70%+ of the lineup.
            Hyperpop made a brief but memorable appearance with 100 gecs, Bladee,
            and Glaive.
          </p>

          <p>
            <span className="text-white font-semibold">2023-2024 marked the house music takeover.</span>{" "}
            Skrillex returned not as the dubstep icon of 2012 but playing a b2b
            with Four Tet. Kaskade b2b John Summit closed Saturday with a pure house
            set. Fisher b2b Chris Lake headlined 2024. The festival moved to
            Hollywood Park in Inglewood, signaling a new era. Hard techno acts like
            INVT appeared for the first time. Hip-hop presence dropped below 5%.
          </p>

          <p>
            <span className="text-white font-semibold">By 2025-2026, the metamorphosis is complete.</span>{" "}
            HARD Summer 2026 headlines Kali Uchis, Charlotte de Witte, Amelie Lens,
            and a Knock2 b2b Zedd set. The Live From Earth stage brings hyperpop
            and experimental acts (2hollis, Snow Strippers, Frost Children). Hard
            techno has its own tier with Brutalismus 3000 and DJ Fuckoff. UK garage
            is represented by Sammy Virji, Interplanetary Criminal, and Bushbaby.
            The only hip-hop presence is DJ Snake doing a hip-hop set and Zack Fox.
          </p>

          <p>
            The data tells a clear story: HARD Summer hasn&apos;t just changed&mdash;it&apos;s
            completely reinvented itself. From a hip-hop-meets-EDM crossover festival
            to a house and techno-forward event with room for bass, drum &amp; bass,
            and experimental sounds. The festival that once needed Ice Cube and Migos
            to sell tickets now trusts Charlotte de Witte and Mau P to fill
            Hollywood Park. That&apos;s not just genre evolution&mdash;it&apos;s a reflection
            of how electronic music culture in Los Angeles has matured.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="w-16 h-px bg-zinc-700 mx-auto mb-12" />

      {/* Top 5 Most Played */}
      <section className="mb-16">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white text-center mb-2">
          Most Played Artists
        </h2>
        <p className="text-sm text-zinc-500 text-center mb-8">
          The 5 artists who&apos;ve graced the HARD Summer stage the most
        </p>

        <div className="max-w-2xl mx-auto space-y-4">
          {top5.map((artist, index) => (
            <div
              key={artist.name}
              className="flex items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-600 transition-all"
            >
              <div
                className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-black text-xl ${
                  index === 0
                    ? "bg-gradient-to-br from-yellow-400 to-amber-600 text-black"
                    : index === 1
                    ? "bg-gradient-to-br from-zinc-300 to-zinc-500 text-black"
                    : index === 2
                    ? "bg-gradient-to-br from-amber-600 to-amber-800 text-white"
                    : "bg-zinc-800 text-zinc-400"
                }`}
              >
                {index + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-white truncate">
                    {artist.name}
                  </h3>
                  <span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: `${GENRE_COLORS[artist.primaryGenre]}33`,
                      color: GENRE_COLORS[artist.primaryGenre],
                    }}
                  >
                    {artist.primaryGenre}
                  </span>
                </div>
                <p className="text-xs text-zinc-500">
                  {artist.count} year{artist.count !== 1 ? "s" : ""}:{" "}
                  <span className="text-zinc-400">
                    {artist.years.map((y) => `'${String(y).slice(-2)}`).join(", ")}
                  </span>
                </p>
              </div>
              <div className="flex-shrink-0 text-right">
                <span className="text-2xl font-black text-zinc-600">
                  {artist.count}x
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="w-16 h-px bg-zinc-700 mx-auto mb-12" />

      {/* Legends Section */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white text-center mb-2">
          HARD Summer Legends
        </h2>
        <p className="text-sm text-zinc-500 text-center mb-8">
          Artists who&apos;ve played 3 or more years &mdash; the true HARD Summer
          veterans
        </p>

        <div className="max-w-4xl mx-auto">
          {/* Group by appearance count */}
          {[6, 5, 4, 3].map((count) => {
            const group = legends.filter((a) => a.count === count);
            if (group.length === 0) return null;
            return (
              <div key={count} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    {count} Years
                  </span>
                  <div className="flex-1 h-px bg-zinc-800" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {group.map((artist) => (
                    <div
                      key={artist.name}
                      className="flex items-center gap-3 bg-zinc-900/50 border border-zinc-800/50 rounded-lg px-4 py-3 hover:border-zinc-700 transition-all"
                    >
                      <div
                        className="w-2 h-8 rounded-full flex-shrink-0"
                        style={{
                          backgroundColor:
                            GENRE_COLORS[artist.primaryGenre] || "#666",
                        }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-white truncate">
                          {artist.name}
                        </p>
                        <p className="text-[10px] text-zinc-500">
                          {artist.years
                            .map((y) => `'${String(y).slice(-2)}`)
                            .join(", ")}
                        </p>
                      </div>
                      <span
                        className="text-[10px] font-medium px-1.5 py-0.5 rounded flex-shrink-0"
                        style={{
                          backgroundColor: `${GENRE_COLORS[artist.primaryGenre]}22`,
                          color: GENRE_COLORS[artist.primaryGenre],
                        }}
                      >
                        {artist.primaryGenre}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
