import GenreChart from "@/components/GenreChart";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="text-center pt-10 pb-6 px-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
          HARD Summer
        </h1>
        <p className="text-lg text-zinc-400 mt-2">
          Genre Evolution 2015 &ndash; 2026
        </p>
        <p className="text-sm text-zinc-600 mt-1 max-w-xl mx-auto">
          How has the music changed? Explore 11 years of lineup data broken down
          by genre. Click a pie slice or genre row to see which artists represent
          each style.
        </p>
      </header>
      <main className="px-4 pb-16">
        <GenreChart />
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
