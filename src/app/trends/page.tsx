import TrendChart from "@/components/TrendChart";
import Link from "next/link";

export default function TrendsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="text-center pt-10 pb-6 px-4">
        <Link
          href="/"
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-4 inline-block"
        >
          &larr; Back to Yearly Breakdown
        </Link>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
          Genre Trends
        </h1>
        <p className="text-lg text-zinc-400 mt-2">
          Where is HARD Summer headed? (2015 &ndash; 2026)
        </p>
        <p className="text-sm text-zinc-600 mt-1 max-w-xl mx-auto">
          Track how each genre&apos;s share of the lineup has changed over 11 years.
          Click genre pills to show/hide lines. Use the category filters to focus
          on specific genre families.
        </p>
      </header>
      <main className="px-4 pb-16">
        <TrendChart />
      </main>
      <footer className="text-center pb-8 text-xs text-zinc-700">
        Built by{" "}
        <a
          href="https://kylecoleman.ai"
          className="text-zinc-500 hover:text-zinc-300 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          Kyle Coleman
        </a>{" "}
        &middot; Data sourced from public festival lineup announcements
      </footer>
    </div>
  );
}
