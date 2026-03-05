"use client";

import { useState, useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { lineupData, GENRE_COLORS, Genre } from "@/data/lineups";

interface GenreSlice {
  name: Genre;
  count: number;
  percentage: number;
  artists: string[];
}

function computeGenreBreakdown(yearIndex: number): GenreSlice[] {
  const yearData = lineupData[yearIndex];
  if (!yearData || yearData.cancelled) return [];

  const genreMap = new Map<Genre, string[]>();
  for (const artist of yearData.artists) {
    const existing = genreMap.get(artist.genre) || [];
    existing.push(artist.name);
    genreMap.set(artist.genre, existing);
  }

  const total = yearData.artists.length;
  const slices: GenreSlice[] = [];
  for (const [genre, artists] of genreMap.entries()) {
    slices.push({
      name: genre,
      count: artists.length,
      percentage: Math.round((artists.length / total) * 1000) / 10,
      artists,
    });
  }

  slices.sort((a, b) => b.count - a.count);
  return slices;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: GenreSlice }>;
}) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0].payload;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-3 max-w-xs shadow-xl">
      <p className="font-bold text-white text-sm mb-1">
        {data.name} ({data.percentage}%)
      </p>
      <p className="text-zinc-400 text-xs mb-2">
        {data.count} artist{data.count !== 1 ? "s" : ""}
      </p>
      <div className="flex flex-wrap gap-1">
        {data.artists.map((artist) => (
          <span
            key={artist}
            className="text-[10px] bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded"
          >
            {artist}
          </span>
        ))}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function renderCustomizedLabel(props: any) {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
  if (!percent || percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-[10px] font-semibold pointer-events-none"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export default function GenreChart() {
  const years = lineupData.map((y) => y.year);
  const [selectedYearIndex, setSelectedYearIndex] = useState(years.length - 1);
  const [expandedGenre, setExpandedGenre] = useState<Genre | null>(null);

  const yearData = lineupData[selectedYearIndex];
  const genreBreakdown = useMemo(
    () => computeGenreBreakdown(selectedYearIndex),
    [selectedYearIndex]
  );

  const topGenres = useMemo(() => {
    const allGenres = new Set<Genre>();
    lineupData.forEach((yd) => {
      if (!yd.cancelled) {
        yd.artists.forEach((a) => allGenres.add(a.genre));
      }
    });
    return Array.from(allGenres).sort();
  }, []);

  const trendData = useMemo(() => {
    return topGenres.map((genre) => {
      const yearPercentages = lineupData
        .filter((yd) => !yd.cancelled)
        .map((yd) => {
          const total = yd.artists.length;
          const count = yd.artists.filter((a) => a.genre === genre).length;
          return {
            year: yd.year,
            percentage: total > 0 ? Math.round((count / total) * 1000) / 10 : 0,
          };
        });
      return { genre, yearPercentages };
    });
  }, [topGenres]);

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Year Selector */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {years.map((year, index) => {
          const isCancelled = lineupData[index].cancelled;
          return (
            <button
              key={year}
              onClick={() => {
                if (!isCancelled) {
                  setSelectedYearIndex(index);
                  setExpandedGenre(null);
                }
              }}
              disabled={isCancelled}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                isCancelled
                  ? "bg-zinc-800 text-zinc-600 cursor-not-allowed line-through"
                  : selectedYearIndex === index
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30 scale-105"
                  : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              {year}
            </button>
          );
        })}
      </div>

      {yearData.cancelled ? (
        <div className="text-center py-20">
          <p className="text-2xl text-zinc-500">
            {yearData.year} - Cancelled (COVID-19)
          </p>
        </div>
      ) : (
        <>
          {/* Year Info */}
          <div className="text-center mb-6 animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-1">
              HARD Summer {yearData.year}
            </h2>
            <p className="text-zinc-400">{yearData.location}</p>
            <p className="text-zinc-500 text-sm mt-1">
              {yearData.artists.length} artists across{" "}
              {genreBreakdown.length} genres
            </p>
          </div>

          {/* Main Chart + Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Pie Chart */}
            <div className="animate-fade-in">
              <ResponsiveContainer width="100%" height={420}>
                <PieChart>
                  <Pie
                    data={genreBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={180}
                    paddingAngle={2}
                    dataKey="count"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    onClick={(data) => {
                      setExpandedGenre(
                        expandedGenre === data.name ? null : data.name
                      );
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {genreBreakdown.map((entry) => (
                      <Cell
                        key={entry.name}
                        fill={GENRE_COLORS[entry.name] || "#666"}
                        stroke={
                          expandedGenre === entry.name ? "#fff" : "transparent"
                        }
                        strokeWidth={expandedGenre === entry.name ? 3 : 0}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Genre Breakdown List */}
            <div className="animate-fade-in space-y-2 overflow-y-auto max-h-[420px] pr-2">
              {genreBreakdown.map((slice) => (
                <div key={slice.name}>
                  <button
                    onClick={() =>
                      setExpandedGenre(
                        expandedGenre === slice.name ? null : slice.name
                      )
                    }
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-zinc-800 ${
                      expandedGenre === slice.name
                        ? "bg-zinc-800 ring-1 ring-zinc-600"
                        : ""
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-sm flex-shrink-0"
                      style={{
                        backgroundColor: GENRE_COLORS[slice.name] || "#666",
                      }}
                    />
                    <span className="text-sm font-medium text-white flex-1 text-left">
                      {slice.name}
                    </span>
                    <span className="text-sm text-zinc-400">
                      {slice.count} ({slice.percentage}%)
                    </span>
                    <svg
                      className={`w-4 h-4 text-zinc-500 transition-transform ${
                        expandedGenre === slice.name ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {expandedGenre === slice.name && (
                    <div className="pl-10 pb-2 animate-fade-in">
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {slice.artists.map((artist) => (
                          <span
                            key={artist}
                            className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded-md border border-zinc-700"
                          >
                            {artist}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Genre Trend Comparison */}
          <div className="mt-12 mb-8">
            <h3 className="text-xl font-bold text-white mb-6 text-center">
              Genre Trends Over Time (% of Lineup)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left py-2 px-3 text-zinc-400 font-medium sticky left-0 bg-[#0a0a0a] z-10">
                      Genre
                    </th>
                    {lineupData
                      .filter((yd) => !yd.cancelled)
                      .map((yd) => (
                        <th
                          key={yd.year}
                          className={`py-2 px-2 text-center font-medium min-w-[52px] ${
                            yd.year === yearData.year
                              ? "text-purple-400"
                              : "text-zinc-400"
                          }`}
                        >
                          {yd.year.toString().slice(-2)}
                        </th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {trendData
                    .filter((td) =>
                      td.yearPercentages.some((yp) => yp.percentage > 0)
                    )
                    .sort((a, b) => {
                      const aMax = Math.max(
                        ...a.yearPercentages.map((yp) => yp.percentage)
                      );
                      const bMax = Math.max(
                        ...b.yearPercentages.map((yp) => yp.percentage)
                      );
                      return bMax - aMax;
                    })
                    .map((td) => (
                      <tr
                        key={td.genre}
                        className="border-b border-zinc-800/50 hover:bg-zinc-900/50"
                      >
                        <td className="py-2 px-3 sticky left-0 bg-[#0a0a0a] z-10">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-sm flex-shrink-0"
                              style={{
                                backgroundColor:
                                  GENRE_COLORS[td.genre] || "#666",
                              }}
                            />
                            <span className="text-zinc-300 text-xs whitespace-nowrap">
                              {td.genre}
                            </span>
                          </div>
                        </td>
                        {td.yearPercentages.map((yp) => {
                          const intensity = Math.min(yp.percentage / 30, 1);
                          const color = GENRE_COLORS[td.genre] || "#666";
                          return (
                            <td
                              key={yp.year}
                              className={`py-2 px-2 text-center text-xs ${
                                yp.year === yearData.year
                                  ? "ring-1 ring-purple-500/30"
                                  : ""
                              }`}
                              style={{
                                backgroundColor:
                                  yp.percentage > 0
                                    ? `${color}${Math.round(intensity * 60)
                                        .toString(16)
                                        .padStart(2, "0")}`
                                    : "transparent",
                              }}
                            >
                              <span
                                className={
                                  yp.percentage > 0
                                    ? "text-zinc-200"
                                    : "text-zinc-700"
                                }
                              >
                                {yp.percentage > 0
                                  ? `${yp.percentage}%`
                                  : "-"}
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
