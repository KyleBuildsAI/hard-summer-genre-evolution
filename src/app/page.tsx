import GenreChart from "@/components/GenreChart";
import TrendChart from "@/components/TrendChart";
import StoryAndLegends from "@/components/StoryAndLegends";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <header className="text-center pt-10 pb-6 px-4">
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 mb-3">
          A data project by{" "}
          <a
            href="https://kylecoleman.ai"
            className="text-zinc-400 hover:text-white transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Kyle Coleman
          </a>
        </p>
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

      {/* About the Data */}
      <section className="max-w-3xl mx-auto px-4 mb-12">
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-6 md:p-8">
          <h2 className="text-lg font-bold text-white mb-3">About This Project</h2>
          <div className="space-y-3 text-sm text-zinc-400 leading-relaxed">
            <p>
              HARD Summer is my favorite music festival, and I&apos;ve been going
              for years. I was genuinely curious: <span className="text-zinc-200 italic">how
              has the music actually changed?</span> It feels different every year,
              but I wanted to see the data behind that feeling.
            </p>
            <p>
              So I used <span className="text-white font-semibold">Claude Code</span> to
              go out and research every lineup from 2015 to 2026 &mdash; pulling
              from official announcements, press releases, and festival archives
              &mdash; then categorize each of the <span className="text-white font-semibold">800+
              artist appearances</span> by genre. From there I prompted it to build
              an interactive visualization with a clean UI that makes the data
              easy to explore and actually fun to look at.
            </p>
            <p>
              I also built in accuracy checks along the way, cross-referencing
              artist counts and genre classifications against multiple sources to
              make sure the data holds up. This project is a good example of what
              I think strong prompting looks like: knowing the right questions to
              ask, directing an AI to gather and structure real data, and shaping
              the output into something polished and useful.
            </p>
            <p>
              Honestly, it was also just a fun thing to build and share with my
              friends. Half of them didn&apos;t realize how much the festival has
              changed until they saw the charts.
            </p>
          </div>
        </div>
      </section>

      <main className="px-4 pb-16">
        <GenreChart />
        <TrendChart />
        <StoryAndLegends />
      </main>

      {/* Data Methodology */}
      <section className="max-w-3xl mx-auto px-4 pb-12">
        <div className="w-16 h-px bg-zinc-700 mx-auto mb-10" />
        <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white text-center mb-2">
          Data &amp; Methodology
        </h2>
        <p className="text-sm text-zinc-500 text-center mb-8">
          How this dataset was built from scratch
        </p>
        <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600/20 text-purple-400 flex items-center justify-center text-xs font-bold">1</div>
            <div>
              <p className="text-white font-semibold mb-1">Research &amp; Collection</p>
              <p>Prompted Claude Code to research every HARD Summer lineup from 2015 to 2026, pulling from official announcements, EDM Identity, Billboard, Clashfinder, and setlist.fm.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-pink-600/20 text-pink-400 flex items-center justify-center text-xs font-bold">2</div>
            <div>
              <p className="text-white font-semibold mb-1">Classification &amp; Validation</p>
              <p>Each artist categorized by primary genre. B2B sets split into individual artists for accurate counting. Cross-referenced artist counts and genre tags against multiple sources to catch errors.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-600/20 text-orange-400 flex items-center justify-center text-xs font-bold">3</div>
            <div>
              <p className="text-white font-semibold mb-1">Visualization &amp; UI Design</p>
              <p>Directed the build of a clean, interactive UI with pie charts, trend lines, stacked area charts, and a heat map &mdash; designed to make the data easy to explore and shareable with friends.</p>
            </div>
          </div>
        </div>
      </section>

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
        &middot; Data hand-collected and categorized from public festival lineup announcements
      </footer>
    </div>
  );
}
