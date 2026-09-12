"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

/**
 * =======================================================================
 * STUDENT CREDITS ROUTE (TEMPORARILY COMMENTED OUT / ON HOLD)
 * =======================================================================
 * This route is on hold until full details and approvals for all team members
 * are finalized. Once ready, uncomment the full component code below.
 */

export default function StudentCreditsPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center antialiased">
      <div className="max-w-md space-y-4">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center text-xl font-bold">
          🎓
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-amber-400">
          Under Development
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
          The Leadership &amp; Developer Team section is currently being updated with full details and will be live soon.
        </p>
        <div className="pt-2">
          <Link
            href="/student"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-200 hover:text-white hover:bg-neutral-800 text-xs font-semibold transition-all"
          >
            <span>← Back to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

// NOTE: Full previous credits code safely preserved in credits-full.backup.tsx
