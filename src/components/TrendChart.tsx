"use client";

import { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { lineupData, GENRE_COLORS, Genre } from "@/data/lineups";

type GroupKey =
  | "All Genres"
  | "Electronic (House/Tech House/Techno)"
  | "Bass (Dubstep/Bass/Hardstyle)"
  | "Urban (Hip-Hop/R&B/Pop)"
  | "Emerging (DnB/Hard Techno/Hyperpop)";

const GENRE_GROUPS: Record<GroupKey, Genre[]> = {
  "All Genres": [],
  "Electronic (House/Tech House/Techno)": [
    "House",
    "Tech House",
    "Techno",
    "Electro",
    "Trance",
    "Indie Dance",
    "UK Garage",
  ],
  "Bass (Dubstep/Bass/Hardstyle)": [
    "Dubstep",
    "Bass Music",
    "Hardstyle",
    "Trap",
    "Future Bass",
  ],
  "Urban (Hip-Hop/R&B/Pop)": [
    "Hip-Hop/Rap",
    "R&B/Pop",
    "Reggaeton/Latin",
    "Dancehall",
  ],
  "Emerging (DnB/Hard Techno/Hyperpop)": [
    "Drum & Bass",
    "Hard Techno",
    "Hyperpop",
    "Jersey Club",
    "Experimental",
  ],
};

function computeTrendData() {
  const activeYears = lineupData.filter((yd) => !yd.cancelled);
  const allGenres = new Set<Genre>();
  activeYears.forEach((yd) => yd.artists.forEach((a) => allGenres.add(a.genre)));

  const dataPoints = activeYears.map((yd) => {
    const total = yd.artists.length;
    const point: Record<string, number | string> = { year: yd.year };
    for (const genre of allGenres) {
      const count = yd.artists.filter((a) => a.genre === genre).length;
      point[genre] = Math.round((count / total) * 1000) / 10;
    }
    return point;
  });

  return { dataPoints, genres: Array.from(allGenres).sort() };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload || !payload.length) return null;
  const sorted = [...payload].sort(
    (a: { value: number }, b: { value: number }) => b.value - a.value
  );
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 max-w-xs shadow-xl">
      <p className="font-bold text-white text-sm mb-2">HARD Summer {label}</p>
      <div className="space-y-1">
        {sorted
          .filter((entry: { value: number }) => entry.value > 0)
          .map((entry: { name: string; value: number; color: string }) => (
            <div key={entry.name} className="flex items-center gap-2 text-xs">
              <div
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-zinc-300 flex-1">{entry.name}</span>
              <span className="text-zinc-400 font-mono">{entry.value}%</span>
            </div>
          ))}
      </div>
    </div>
  );
}

export default function TrendChart() {
  const { dataPoints, genres } = useMemo(() => computeTrendData(), []);
  const [activeGroup, setActiveGroup] = useState<GroupKey>("All Genres");
  const [hoveredGenre, setHoveredGenre] = useState<string | null>(null);
  const [hiddenGenres, setHiddenGenres] = useState<Set<string>>(new Set());

  const visibleGenres = useMemo(() => {
    const groupGenres = GENRE_GROUPS[activeGroup];
    const filtered =
      groupGenres.length === 0
        ? genres
        : genres.filter((g) => groupGenres.includes(g));
    return filtered.filter((g) => !hiddenGenres.has(g));
  }, [genres, activeGroup, hiddenGenres]);

  const allGroupGenres = useMemo(() => {
    const groupGenres = GENRE_GROUPS[activeGroup];
    return groupGenres.length === 0
      ? genres
      : genres.filter((g) => groupGenres.includes(g));
  }, [genres, activeGroup]);

  const toggleGenre = (genre: string) => {
    setHiddenGenres((prev) => {
      const next = new Set(prev);
      if (next.has(genre)) {
        next.delete(genre);
      } else {
        next.add(genre);
      }
      return next;
    });
  };

  const stackedData = useMemo(() => {
    const activeYears = lineupData.filter((yd) => !yd.cancelled);
    return activeYears.map((yd) => {
      const total = yd.artists.length;
      const point: Record<string, number | string> = { year: yd.year };

      const groupGenres = GENRE_GROUPS[activeGroup];
      const relevantGenres =
        groupGenres.length === 0
          ? genres
          : genres.filter((g) => groupGenres.includes(g));

      for (const genre of relevantGenres) {
        if (!hiddenGenres.has(genre)) {
          const count = yd.artists.filter((a) => a.genre === genre).length;
          point[genre] = Math.round((count / total) * 1000) / 10;
        }
      }
      return point;
    });
  }, [genres, activeGroup, hiddenGenres]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Group Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {(Object.keys(GENRE_GROUPS) as GroupKey[]).map((group) => (
          <button
            key={group}
            onClick={() => {
              setActiveGroup(group);
              setHiddenGenres(new Set());
            }}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
              activeGroup === group
                ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
            }`}
          >
            {group}
          </button>
        ))}
      </div>

      {/* Genre Legend (clickable to toggle) */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {allGroupGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => toggleGenre(genre)}
            onMouseEnter={() => setHoveredGenre(genre)}
            onMouseLeave={() => setHoveredGenre(null)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs transition-all ${
              hiddenGenres.has(genre)
                ? "opacity-30 line-through"
                : "opacity-100"
            } hover:ring-1 hover:ring-zinc-500`}
          >
            <div
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{
                backgroundColor: GENRE_COLORS[genre as Genre] || "#666",
              }}
            />
            <span className="text-zinc-300">{genre}</span>
          </button>
        ))}
      </div>

      {/* Line Chart */}
      <div className="mb-12">
        <h3 className="text-lg font-bold text-white mb-4 text-center">
          Genre Percentage Over Time (Line Chart)
        </h3>
        <ResponsiveContainer width="100%" height={500}>
          <LineChart
            data={dataPoints}
            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis
              dataKey="year"
              stroke="#888"
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => `'${String(v).slice(-2)}`}
            />
            <YAxis
              stroke="#888"
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => `${v}%`}
              domain={[0, "auto"]}
            />
            <Tooltip content={<CustomTooltip />} />
            {visibleGenres.map((genre) => (
              <Line
                key={genre}
                type="monotone"
                dataKey={genre}
                stroke={GENRE_COLORS[genre as Genre] || "#666"}
                strokeWidth={
                  hoveredGenre === genre
                    ? 4
                    : hoveredGenre
                    ? 1
                    : 2
                }
                dot={{ r: hoveredGenre === genre ? 5 : 3 }}
                opacity={
                  hoveredGenre && hoveredGenre !== genre ? 0.2 : 1
                }
                connectNulls
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Stacked Area Chart */}
      <div className="mb-12">
        <h3 className="text-lg font-bold text-white mb-4 text-center">
          Genre Share Over Time (Stacked Area)
        </h3>
        <ResponsiveContainer width="100%" height={500}>
          <AreaChart
            data={stackedData}
            margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis
              dataKey="year"
              stroke="#888"
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => `'${String(v).slice(-2)}`}
            />
            <YAxis
              stroke="#888"
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip content={<CustomTooltip />} />
            {visibleGenres.map((genre) => (
              <Area
                key={genre}
                type="monotone"
                dataKey={genre}
                stackId="1"
                stroke={GENRE_COLORS[genre as Genre] || "#666"}
                fill={GENRE_COLORS[genre as Genre] || "#666"}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Key Takeaways */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <TakeawayCard
          title="House & Tech House Rising"
          color="#6366f1"
          description="House music genres have grown from ~25% of lineups in 2015 to 40%+ by 2025-2026, becoming the dominant sound of the festival."
        />
        <TakeawayCard
          title="Hip-Hop Retreat"
          color="#eab308"
          description="Hip-Hop peaked at 25-30% during 2017-2019 (Migos, Travis Scott era) and has declined to under 5% by 2025-2026."
        />
        <TakeawayCard
          title="Drum & Bass Emerges"
          color="#10b981"
          description="Virtually absent before 2022, DnB now commands 5-7% of lineups with acts like Chase & Status, Dimension, and Andy C."
        />
        <TakeawayCard
          title="Hard Techno Wave"
          color="#4c1d95"
          description="A new genre category appearing in 2024-2025 with Sara Landry, 999999999, and Brutalismus 3000 leading the charge."
        />
        <TakeawayCard
          title="Future Bass Faded"
          color="#06b6d4"
          description="Once claiming 15-20% of lineups (2015-2016), Future Bass has steadily declined as tastes shifted toward harder sounds."
        />
        <TakeawayCard
          title="Trap Evolution"
          color="#f59e0b"
          description="Trap maintained a strong 10-15% through 2019, then gradually decreased as festival-trap artists pivoted to other styles."
        />
      </div>
    </div>
  );
}

function TakeawayCard({
  title,
  color,
  description,
}: {
  title: string;
  color: string;
  description: string;
}) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: color }}
        />
        <h4 className="text-sm font-bold text-white">{title}</h4>
      </div>
      <p className="text-xs text-zinc-400 leading-relaxed">{description}</p>
    </div>
  );
}
