import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-black relative flex flex-col items-center justify-center p-0 sm:p-6 overflow-hidden select-none">
      {/* Dynamic Ambient Gradient Background Blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[15%] -left-[10%] w-[550px] h-[550px] bg-gradient-to-br from-indigo-600/20 via-purple-600/15 to-transparent rounded-full blur-3xl opacity-75 animate-pulse" />
        <div className="absolute -bottom-[15%] -right-[10%] w-[550px] h-[550px] bg-gradient-to-tl from-pink-600/20 via-purple-600/15 to-transparent rounded-full blur-3xl opacity-75" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-indigo-950/25 rounded-full blur-[130px] pointer-events-none" />
      </div>

      {/* Main Container - Full Mobile Screen Slide & Centered Desktop Card */}
      <div className="w-full sm:max-w-md min-h-[100dvh] sm:min-h-0 relative z-10 flex flex-col">
        <div className="flex-1 sm:flex-initial bg-neutral-900/80 sm:bg-neutral-900/75 backdrop-blur-2xl sm:border sm:border-neutral-800/90 sm:rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col justify-between items-center text-center">
          
          {/* Top Radiant Gradient Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]" />

          {/* TOP SECTION: Class Badge */}
          <div className="w-full pt-4 sm:pt-0 flex justify-center">
            <span className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-purple-950/60 border border-purple-800/50 text-xs font-semibold text-purple-300 shadow-sm">
              <svg className="w-4 h-4 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              <span>MCA Class of 26-27</span>
            </span>
          </div>

          {/* CENTER SECTION: Hero Slide Content */}
          <div className="w-full my-auto py-6 flex flex-col items-center">
            {/* Bold Academic Book Icon Frame */}
            <div className="relative mb-6 sm:mb-7">
              <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur-md opacity-45 animate-pulse pointer-events-none" />
              <div className="relative w-22 h-22 sm:w-24 sm:h-24 bg-gradient-to-b from-neutral-800/95 to-neutral-900/95 border border-neutral-700/70 rounded-3xl flex items-center justify-center shadow-[0_10px_35px_rgba(0,0,0,0.6)]">
                <svg className="w-11 h-11 sm:w-12 sm:h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-400 bg-clip-text text-transparent mb-2.5">
              MCA Attendance
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 font-medium mb-6 sm:mb-8 max-w-xs px-2">
              Class Representative Portal & Student Analytics
            </p>

            {/* Features Quick Highlight Cards (Responsive SVG Icons) */}
            <div className="w-full grid grid-cols-3 gap-2.5 sm:gap-3 text-[11px]">
              {/* Live Stats */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-neutral-950/75 border border-neutral-800/80 flex flex-col items-center hover:border-neutral-700 transition-all">
                <svg className="w-5 h-5 text-indigo-400 mb-1.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="text-neutral-300 font-medium">Live Stats</span>
              </div>

              {/* Materials */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-neutral-950/75 border border-neutral-800/80 flex flex-col items-center hover:border-neutral-700 transition-all">
                <svg className="w-5 h-5 text-purple-400 mb-1.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <span className="text-neutral-300 font-medium">Materials</span>
              </div>

              {/* Fast Sync */}
              <div className="p-3 sm:p-3.5 rounded-2xl bg-neutral-950/75 border border-neutral-800/80 flex flex-col items-center hover:border-neutral-700 transition-all">
                <svg className="w-5 h-5 text-pink-400 mb-1.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-neutral-300 font-medium">Fast Sync</span>
              </div>
            </div>
          </div>

          {/* BOTTOM SECTION: CTA Button & Footer */}
          <div className="w-full pb-4 sm:pb-0 flex flex-col space-y-4">
            <Link 
              href="/login"
              className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold py-4 rounded-2xl shadow-[0_0_25px_rgba(147,51,234,0.35)] hover:shadow-[0_0_35px_rgba(147,51,234,0.55)] transition-all hover:scale-[1.01] active:scale-[0.99] text-center flex items-center justify-center space-x-2 text-sm cursor-pointer"
            >
              <span>Login to Portal</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>

            <div className="pt-2 sm:pt-4 sm:border-t sm:border-neutral-800/80 text-[11px] text-neutral-500 font-medium">
              <span>MCA Class of 26-27</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
