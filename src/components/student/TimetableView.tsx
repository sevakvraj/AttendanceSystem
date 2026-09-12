"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getCustomSlots, CustomSlot } from "@/services/db";

export interface TimetableClass {
  time: string;
  code: string;
  subject: string;
  faculty: string;
  type: "Lecture" | "Lab";
  theme: "cyan" | "blue" | "emerald" | "purple" | "amber" | "rose";
}

export const TIMETABLE_CLASSES: Record<string, TimetableClass[]> = {
  Monday: [
    { time: "10:30 AM - 12:30 PM", code: "LAB", subject: "Practical Lab", faculty: "Lab Faculty", type: "Lab", theme: "cyan" },
    { time: "12:30 PM - 1:30 PM", code: "C55", subject: "Computer Fundamental", faculty: "Prof. AAP", type: "Lecture", theme: "blue" },
    { time: "2:30 PM - 3:30 PM", code: "C51", subject: "Python Programming", faculty: "Prof. PPP", type: "Lecture", theme: "emerald" },
    { time: "3:30 PM - 4:30 PM", code: "C54", subject: "Operating System", faculty: "Prof. LSL", type: "Lecture", theme: "purple" },
    { time: "4:30 PM - 5:30 PM", code: "C52", subject: "Computer Network", faculty: "Prof. TMS", type: "Lecture", theme: "amber" },
  ],
  Tuesday: [
    { time: "10:30 AM - 12:30 PM", code: "LAB", subject: "Practical Lab", faculty: "Lab Faculty", type: "Lab", theme: "cyan" },
    { time: "12:30 PM - 1:30 PM", code: "C55", subject: "Computer Fundamental", faculty: "Prof. AAP", type: "Lecture", theme: "blue" },
    { time: "2:30 PM - 3:30 PM", code: "C51", subject: "Python Programming", faculty: "Prof. PPP", type: "Lecture", theme: "emerald" },
    { time: "3:30 PM - 4:30 PM", code: "C54", subject: "Operating System", faculty: "Prof. LSL", type: "Lecture", theme: "purple" },
    { time: "4:30 PM - 5:30 PM", code: "C52", subject: "Computer Network", faculty: "Prof. AAP", type: "Lecture", theme: "amber" },
  ],
  Wednesday: [
    { time: "10:30 AM - 12:30 PM", code: "LAB", subject: "Practical Lab", faculty: "Lab Faculty", type: "Lab", theme: "cyan" },
    { time: "12:30 PM - 1:30 PM", code: "C54", subject: "Operating System", faculty: "Prof. VLD", type: "Lecture", theme: "purple" },
    { time: "2:30 PM - 3:30 PM", code: "C53", subject: "DBMS", faculty: "Prof. JVS", type: "Lecture", theme: "rose" },
    { time: "3:30 PM - 4:30 PM", code: "C51", subject: "Python Programming", faculty: "Prof. PPP", type: "Lecture", theme: "emerald" },
    { time: "4:30 PM - 5:30 PM", code: "C52", subject: "Computer Network", faculty: "Prof. AAP", type: "Lecture", theme: "amber" },
  ],
  Thursday: [
    { time: "10:30 AM - 12:30 PM", code: "LAB", subject: "Practical Lab", faculty: "Lab Faculty", type: "Lab", theme: "cyan" },
    { time: "12:30 PM - 1:30 PM", code: "C54", subject: "Operating System", faculty: "Prof. VLD", type: "Lecture", theme: "purple" },
    { time: "2:30 PM - 3:30 PM", code: "C53", subject: "DBMS", faculty: "Prof. JVS", type: "Lecture", theme: "rose" },
    { time: "3:30 PM - 4:30 PM", code: "C51", subject: "Python Programming", faculty: "Prof. PPP", type: "Lecture", theme: "emerald" },
  ],
  Friday: [
    { time: "10:30 AM - 12:30 PM", code: "LAB", subject: "Practical Lab", faculty: "Lab Faculty", type: "Lab", theme: "cyan" },
    { time: "12:30 PM - 1:30 PM", code: "C52", subject: "Computer Network", faculty: "Prof. TMS", type: "Lecture", theme: "amber" },
    { time: "2:30 PM - 3:30 PM", code: "C53", subject: "DBMS", faculty: "Prof. PPP", type: "Lecture", theme: "rose" },
    { time: "3:30 PM - 4:30 PM", code: "C55", subject: "Computer Fundamental", faculty: "Prof. AAP", type: "Lecture", theme: "blue" },
  ],
  Saturday: [
    { time: "10:30 AM - 12:30 PM", code: "LAB", subject: "Practical Lab", faculty: "Lab Faculty", type: "Lab", theme: "cyan" },
    { time: "12:30 PM - 1:30 PM", code: "C55", subject: "Computer Fundamental", faculty: "Prof. AAP", type: "Lecture", theme: "blue" },
    { time: "2:30 PM - 3:30 PM", code: "C53", subject: "DBMS", faculty: "Prof. PPP", type: "Lecture", theme: "rose" },
  ],
};

const THEME_STYLES = {
  cyan: {
    cardBg: "bg-gradient-to-br from-cyan-950/40 via-neutral-900 to-neutral-950",
    border: "border-cyan-500/30 hover:border-cyan-400/50 shadow-[0_4px_20px_rgba(6,182,212,0.08)]",
    codeBadge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
    typeBadge: "bg-cyan-950/60 text-cyan-400 border-cyan-800/50",
    timeBadge: "bg-neutral-900/90 text-cyan-200 border-cyan-800/40",
    accentBar: "bg-gradient-to-b from-cyan-400 to-teal-500",
    facultyColor: "text-cyan-300/80",
  },
  blue: {
    cardBg: "bg-gradient-to-br from-blue-950/40 via-neutral-900 to-neutral-950",
    border: "border-blue-500/30 hover:border-blue-400/50 shadow-[0_4px_20px_rgba(59,130,246,0.08)]",
    codeBadge: "bg-blue-500/15 text-blue-300 border-blue-500/30",
    typeBadge: "bg-blue-950/60 text-blue-400 border-blue-800/50",
    timeBadge: "bg-neutral-900/90 text-blue-200 border-blue-800/40",
    accentBar: "bg-gradient-to-b from-blue-400 to-indigo-500",
    facultyColor: "text-blue-300/80",
  },
  emerald: {
    cardBg: "bg-gradient-to-br from-emerald-950/40 via-neutral-900 to-neutral-950",
    border: "border-emerald-500/30 hover:border-emerald-400/50 shadow-[0_4px_20px_rgba(16,185,129,0.08)]",
    codeBadge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    typeBadge: "bg-emerald-950/60 text-emerald-400 border-emerald-800/50",
    timeBadge: "bg-neutral-900/90 text-emerald-200 border-emerald-800/40",
    accentBar: "bg-gradient-to-b from-emerald-400 to-teal-500",
    facultyColor: "text-emerald-300/80",
  },
  purple: {
    cardBg: "bg-gradient-to-br from-purple-950/40 via-neutral-900 to-neutral-950",
    border: "border-purple-500/30 hover:border-purple-400/50 shadow-[0_4px_20px_rgba(168,85,247,0.08)]",
    codeBadge: "bg-purple-500/15 text-purple-300 border-purple-500/30",
    typeBadge: "bg-purple-950/60 text-purple-400 border-purple-800/50",
    timeBadge: "bg-neutral-900/90 text-purple-200 border-purple-800/40",
    accentBar: "bg-gradient-to-b from-purple-400 to-violet-500",
    facultyColor: "text-purple-300/80",
  },
  amber: {
    cardBg: "bg-gradient-to-br from-amber-950/40 via-neutral-900 to-neutral-950",
    border: "border-amber-500/30 hover:border-amber-400/50 shadow-[0_4px_20px_rgba(245,158,11,0.08)]",
    codeBadge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    typeBadge: "bg-amber-950/60 text-amber-400 border-amber-800/50",
    timeBadge: "bg-neutral-900/90 text-amber-200 border-amber-800/40",
    accentBar: "bg-gradient-to-b from-amber-400 to-orange-500",
    facultyColor: "text-amber-300/80",
  },
  rose: {
    cardBg: "bg-gradient-to-br from-rose-950/40 via-neutral-900 to-neutral-950",
    border: "border-rose-500/30 hover:border-rose-400/50 shadow-[0_4px_20px_rgba(244,63,94,0.08)]",
    codeBadge: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    typeBadge: "bg-rose-950/60 text-rose-400 border-rose-800/50",
    timeBadge: "bg-neutral-900/90 text-rose-200 border-rose-800/40",
    accentBar: "bg-gradient-to-b from-rose-400 to-pink-500",
    facultyColor: "text-rose-300/80",
  },
};

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface TimetableViewProps {
  onBack: () => void;
}

export default function TimetableView({ onBack }: TimetableViewProps) {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [customSlots, setCustomSlots] = useState<CustomSlot[]>([]);

  useEffect(() => {
    getCustomSlots()
      .then(setCustomSlots)
      .catch(err => console.error("Error loading custom timetable slots:", err));
  }, []);

  const currentClasses = useMemo(() => {
    const base = TIMETABLE_CLASSES[selectedDay] || [];
    const customForDay = customSlots.filter(s => s.day === selectedDay);

    const convertedCustom: TimetableClass[] = customForDay.map(s => {
      let theme = s.theme;
      if (!theme) {
        const codeUpper = s.code.toUpperCase();
        if (codeUpper === "LAB") theme = "cyan";
        else if (codeUpper === "C55") theme = "blue";
        else if (codeUpper === "C51") theme = "emerald";
        else if (codeUpper === "C54") theme = "purple";
        else if (codeUpper === "C52") theme = "amber";
        else if (codeUpper === "C53") theme = "rose";
        else theme = "blue";
      }

      return {
        time: s.time,
        code: s.code,
        subject: s.subject,
        faculty: s.faculty,
        type: s.type,
        theme,
      };
    });

    return [...base, ...convertedCustom];
  }, [selectedDay, customSlots]);

  return (
    <div className="space-y-4 pb-6">
      {/* Top Header */}
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
        <span className="text-xs font-black uppercase tracking-wider text-amber-400">
          Weekly Time Table
        </span>
      </div>

      {/* Title & Batch Info (Room No removed everywhere) */}
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-white font-extrabold text-lg tracking-tight">MCA-I Timetable</h2>
          <p className="text-neutral-500 text-xs font-bold mt-0.5">Batch 1</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 px-3 py-1 rounded-lg text-xs font-bold text-neutral-300 shadow-sm">
          Sem 1
        </div>
      </div>

      {/* Horizontal Day Selector with glowing pill style */}
      <div className="flex space-x-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {DAYS_OF_WEEK.map((day) => {
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                isSelected
                  ? "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 text-neutral-950 font-black shadow-md shadow-amber-950/50 scale-105"
                  : "bg-neutral-900/80 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 hover:border-neutral-700"
              }`}
            >
              {day.slice(0, 3)}
            </button>
          );
        })}
      </div>

      {/* Classes list container with aesthetic gradient cards */}
      <div className="space-y-3 pt-1">
        {currentClasses.map((cls, cIdx) => {
          const theme = THEME_STYLES[cls.theme] || THEME_STYLES.blue;

          return (
            <React.Fragment key={cIdx}>
              {/* Mid-day Lunch Break / Recess indicator between slot 2 and slot 3 */}
              {cIdx === 2 && (
                <div className="flex items-center justify-center py-1">
                  <div className="flex items-center gap-2 bg-gradient-to-r from-neutral-900/60 via-neutral-900 to-neutral-900/60 border border-neutral-800 px-4 py-1.5 rounded-full text-neutral-400 text-[11px] font-semibold shadow-sm">
                    <span className="text-amber-400 text-xs">☕</span>
                    <span>Recess / Lunch Break</span>
                    <span className="text-neutral-700">•</span>
                    <span className="text-neutral-500 font-mono text-[10px]">1:30 PM - 2:30 PM</span>
                  </div>
                </div>
              )}

              {/* Class Card */}
              <div
                className={`relative rounded-2xl p-4 border transition-all duration-300 overflow-hidden ${theme.cardBg} ${theme.border}`}
              >
                {/* Left vertical gradient accent bar */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${theme.accentBar}`} />

                <div className="pl-1.5 space-y-2.5">
                  {/* Top row: Code + Type + Time badge */}
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${theme.codeBadge}`}>
                        {cls.code}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${theme.typeBadge}`}>
                        {cls.type}
                      </span>
                    </div>

                    <div className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-lg border ${theme.timeBadge}`}>
                      <svg className="w-3 h-3 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{cls.time}</span>
                    </div>
                  </div>

                  {/* Subject Name */}
                  <h3 className="text-white font-extrabold text-base tracking-tight leading-snug">
                    {cls.subject}
                  </h3>

                  {/* Faculty Name */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <div className="w-5 h-5 rounded-full bg-neutral-800/90 border border-neutral-700/80 flex items-center justify-center text-[10px] text-neutral-300">
                      👤
                    </div>
                    <span className={`text-xs font-semibold ${theme.facultyColor}`}>
                      {cls.faculty}
                    </span>
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
