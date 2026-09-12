"use client";

import React from "react";
import { HOLIDAYS_2026 } from "@/lib/constants";

interface HolidayViewProps {
  onBack: () => void;
}

export default function HolidayView({ onBack }: HolidayViewProps) {
  const holidayEntries = Object.entries(HOLIDAYS_2026).sort(([dateA], [dateB]) =>
    dateA.localeCompare(dateB)
  );

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
      <div className="flex justify-between items-center px-1">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-neutral-400 hover:text-white transition-colors bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
        <span className="text-xs font-black uppercase tracking-wider text-teal-400">
          Holiday Calendar
        </span>
      </div>

      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-white font-extrabold text-lg tracking-tight">Academic Year 2026</h2>
          <p className="text-neutral-500 text-xs font-bold mt-0.5">Approved University Holidays</p>
        </div>
        <div className="bg-teal-950/40 border border-teal-800/50 px-3 py-1 rounded-lg text-xs font-bold text-teal-400">
          {holidayEntries.length} Holidays
        </div>
      </div>

      {/* Holiday list */}
      <div className="space-y-2.5">
        {holidayEntries.map(([date, name]) => {
          const dateObj = new Date(date);
          const isPast = dateObj < new Date();
          const monthName = dateObj.toLocaleString("default", { month: "short" });
          const dayNum = dateObj.getDate();
          const dayName = dateObj.toLocaleString("default", { weekday: "short" });

          return (
            <div
              key={date}
              className={`flex items-center p-3.5 rounded-2xl border transition-all ${
                isPast
                  ? "bg-neutral-900/40 border-neutral-800/40 opacity-55"
                  : "bg-neutral-900 border-neutral-800 hover:border-neutral-700 shadow-sm"
              }`}
            >
              <div
                className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl mr-3.5 flex-shrink-0 ${
                  isPast
                    ? "bg-neutral-950 text-neutral-500"
                    : "bg-teal-950/80 text-teal-400 border border-teal-800/50 shadow-inner"
                }`}
              >
                <span className="text-[9px] uppercase font-bold tracking-widest">{monthName}</span>
                <span className="text-lg font-black leading-none mt-0.5">{dayNum}</span>
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <h3 className={`font-bold text-sm truncate ${isPast ? "text-neutral-400" : "text-white"}`}>
                  {name}
                </h3>
                <p className="text-[11px] font-medium text-neutral-500 mt-0.5">{dayName} • 2026</p>
              </div>
              {!isPast ? (
                <div className="px-2.5 py-1 bg-teal-500/10 rounded-lg border border-teal-500/20 flex-shrink-0">
                  <span className="text-[9px] font-extrabold text-teal-400 uppercase tracking-wider">
                    Upcoming
                  </span>
                </div>
              ) : (
                <div className="px-2.5 py-1 bg-neutral-950 rounded-lg border border-neutral-800/80 flex-shrink-0">
                  <span className="text-[9px] font-semibold text-neutral-500 uppercase tracking-wider">
                    Passed
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
