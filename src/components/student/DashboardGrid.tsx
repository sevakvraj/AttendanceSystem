"use client";

import React from "react";

interface DashboardGridProps {
  onSelectView: (view: "attendance" | "timetable" | "holidays" | "assignments" | "materials" | "papers") => void;
  overallPercentage: string;
}

export const DRIVE_MATERIAL_URL = "https://drive.google.com/drive/folders/1UdDOwv5RHH6vISNSpqbOTmEbN3geUOGQ?usp=sharing";
export const DRIVE_PAPERS_URL = "https://drive.google.com/drive/folders/15uX8l4EUYnN_z6JAXsQMSILrzF63K2du";

export default function DashboardGrid({ onSelectView, overallPercentage }: DashboardGridProps) {
  const items = [
    {
      id: "attendance",
      title: "Attendance",
      subtitle: `${overallPercentage}% Overall`,
      action: () => onSelectView("attendance"),
      iconColor: "text-emerald-400",
      iconBg: "bg-emerald-500/10 border border-emerald-500/20",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: "material",
      title: "Study Material",
      subtitle: "Lecture Notes & PPTs",
      action: () => onSelectView("materials"),
      iconColor: "text-blue-400",
      iconBg: "bg-blue-500/10 border border-blue-500/20",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      id: "papers",
      title: "Old Papers",
      subtitle: "Previous Year Exams",
      action: () => onSelectView("papers"),
      iconColor: "text-purple-400",
      iconBg: "bg-purple-500/10 border border-purple-500/20",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: "assignments",
      title: "Assignments",
      subtitle: "Semester Coursework",
      action: () => onSelectView("assignments"),
      iconColor: "text-rose-400",
      iconBg: "bg-rose-500/10 border border-rose-500/20",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
    },
    {
      id: "timetable",
      title: "Time Table",
      subtitle: "Class Schedule",
      action: () => onSelectView("timetable"),
      iconColor: "text-amber-400",
      iconBg: "bg-amber-500/10 border border-amber-500/20",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: "holidays",
      title: "Holiday List",
      subtitle: "Academic Calendar",
      action: () => onSelectView("holidays"),
      iconColor: "text-teal-400",
      iconBg: "bg-teal-500/10 border border-teal-500/20",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-3 pb-6">
      {/* Clean 2-column Grid without badges */}
      <div className="grid grid-cols-2 gap-3.5">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={item.action}
            className="flex flex-col items-start p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/60 transition-all duration-200 shadow-sm text-left group active:scale-[0.98]"
          >
            <div className={`w-12 h-12 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-inner`}>
              {item.icon}
            </div>

            <h4 className="text-sm font-bold text-white group-hover:text-teal-400 transition-colors">
              {item.title}
            </h4>
            <p className="text-[11px] font-medium text-neutral-400 mt-0.5 line-clamp-1">
              {item.subtitle}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
