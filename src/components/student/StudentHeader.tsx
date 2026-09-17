"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth-client";

interface StudentHeaderProps {
  name: string;
  pid: string;
  overallPercentage: string;
  totalPresent: number;
  totalClasses: number;
  onOpenPasswordModal: () => void;
  onSelectView?: (view: string) => void;
  currentView?: string;
}

export function getInitials(fullName: string): string {
  if (!fullName) return "ST";
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const first = parts[0][0] || "";
  const last = parts[parts.length - 1][0] || "";
  return (first + last).toUpperCase();
}

export default function StudentHeader({
  name,
  pid,
  overallPercentage,
  totalPresent,
  totalClasses,
  onOpenPasswordModal,
  onSelectView,
  currentView = "home",
}: StudentHeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const initials = getInitials(name);

  return (
    <div className="bg-gradient-to-b from-[#181a20] to-[#121316] text-white p-6 pt-8 rounded-b-[2.2rem] border-b border-neutral-800 shadow-[0_12px_32px_rgba(0,0,0,0.6)] relative z-20">
      {/* Top row: University / Dept + Profile Avatar */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-[11px] uppercase tracking-widest text-teal-400 font-extrabold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            MCA Department
          </span>
          <h1 className="text-lg font-black tracking-tight text-white mt-0.5">
            Student Portal
          </h1>
        </div>

        {/* Profile Avatar with Initials + Settings dropdown trigger */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 group focus:outline-none"
            title="Profile & Settings"
          >
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-teal-500 via-emerald-500 to-amber-400 p-[2px] shadow-lg shadow-teal-950/50 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center text-sm font-black text-white tracking-wider">
                {initials}
              </div>
            </div>
          </button>

          {/* Settings Menu Dropdown */}
          {isMenuOpen && (
            <div className="absolute right-0 mt-3 w-64 bg-neutral-900/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.85)] py-2 text-white border border-neutral-700/60 z-50 overflow-hidden transform origin-top-right transition-all">
              <div className="px-5 py-3 border-b border-neutral-800/80 bg-neutral-950/40">
                <p className="text-xs font-bold text-white truncate">{name}</p>
                <p className="text-[11px] text-neutral-400 font-mono mt-0.5">{pid}</p>
              </div>

              <button
                onClick={() => {
                  onSelectView?.("home");
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-5 py-3 hover:bg-gradient-to-r hover:from-teal-600/20 hover:to-transparent font-bold text-xs transition-all border-b border-neutral-800/40 text-neutral-300 hover:text-white"
              >
                <svg className="w-4 h-4 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span>Dashboard Home</span>
              </button>

              <button
                onClick={() => {
                  router.push("/student/memories");
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-5 py-3 hover:bg-gradient-to-r hover:from-pink-600/20 hover:to-transparent font-bold text-xs transition-all border-b border-neutral-800/40 text-neutral-300 hover:text-white cursor-pointer"
              >
                <svg className="w-4 h-4 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Batch Memories</span>
              </button>

              {/* Temporarily commented out until full credits details are finalized
              <button
                onClick={() => {
                  router.push("/student/credits");
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-5 py-3 hover:bg-gradient-to-r hover:from-indigo-600/20 hover:to-transparent font-bold text-xs transition-all border-b border-neutral-800/40 text-neutral-300 hover:text-white cursor-pointer"
              >
                <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span>CR &amp; Developer Team</span>
              </button>
              */}

              <button
                onClick={() => {
                  onOpenPasswordModal();
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center space-x-3 px-5 py-3 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-transparent font-bold text-xs transition-all border-b border-neutral-800/40 text-neutral-300 hover:text-white"
              >
                <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <span>Change Password</span>
              </button>

              <button
                onClick={() => logout()}
                className="w-full flex items-center space-x-3 px-5 py-3 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-transparent text-red-400 hover:text-red-300 font-bold text-xs transition-all cursor-pointer"
              >
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Student Identity Card (Darshan Univ Style) */}
      <div className="mb-4">
        <h2 className="text-xl font-black text-amber-400 tracking-tight leading-tight">
          {name}
        </h2>
        <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-500 block">Department</span>
            <span className="font-bold text-white">MCA (Sem-1)</span>
          </div>
          <div className="w-[1px] h-6 bg-neutral-800"></div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-500 block">Student PID</span>
            <span className="font-bold text-white font-mono">{pid}</span>
          </div>
          <div className="w-[1px] h-6 bg-neutral-800"></div>
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-500 block">Attendance</span>
            <span className={`font-bold ${parseFloat(overallPercentage) >= 75 ? "text-emerald-400" : "text-amber-400"}`}>
              {overallPercentage}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
