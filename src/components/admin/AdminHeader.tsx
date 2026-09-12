"use client";

import React, { useState } from "react";

export type AdminView = "rollcall" | "report" | "assignments" | "timetable" | "materials" | "add_student";

interface AdminHeaderProps {
  currentView: AdminView;
  onSelectView: (view: AdminView) => void;
  onLogout: () => void;
  children?: React.ReactNode;
}

export default function AdminHeader({
  currentView,
  onSelectView,
  onLogout,
  children,
}: AdminHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems: { id: AdminView; label: string; color: string; icon: React.ReactNode }[] = [
    {
      id: "rollcall",
      label: "Roll Call Dashboard",
      color: "text-blue-400",
      icon: (
        <svg className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      ),
    },
    {
      id: "report",
      label: "Class Attendance Report",
      color: "text-emerald-400",
      icon: (
        <svg className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: "timetable",
      label: "Manage Timetable",
      color: "text-amber-400",
      icon: (
        <svg className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: "materials",
      label: "Manage Materials & Papers",
      color: "text-cyan-400",
      icon: (
        <svg className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
    },
    {
      id: "assignments",
      label: "Manage Assignments",
      color: "text-rose-400",
      icon: (
        <svg className="w-5 h-5 text-rose-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: "add_student",
      label: "Add New Student",
      color: "text-purple-400",
      icon: (
        <svg className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-neutral-900 p-6 pt-10 text-white rounded-b-[2rem] border-b border-neutral-800 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative z-20 transition-all duration-500">
      <div className="flex justify-between items-center relative z-20 mb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Admin Portal</h1>
          <p className="text-neutral-400 font-medium text-sm mt-1">
            Class Representative Mode
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="bg-neutral-800 hover:bg-neutral-700 p-2.5 rounded-xl transition-all shadow-sm border border-neutral-700"
            title="Admin Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {isMenuOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-neutral-900/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] py-2 text-white border border-neutral-700/50 z-50 overflow-hidden transform origin-top-right transition-all">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectView(item.id);
                    setIsMenuOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-5 py-3.5 hover:bg-gradient-to-r font-bold text-sm transition-all border-b border-neutral-800/50 group ${
                    currentView === item.id
                      ? "bg-neutral-800/60 text-white"
                      : "text-neutral-300 hover:text-white"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center space-x-3 px-5 py-3.5 mt-1 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-transparent text-red-500 font-bold text-sm transition-all group"
              >
                <svg className="w-5 h-5 text-red-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}
