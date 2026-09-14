"use client";

import React, { useState, useMemo } from "react";
import { Student } from "@/services/db";
import StudentDetailModal from "./StudentDetailModal";

interface ReportsModuleProps {
  students: Student[];
  classStats: Record<string, { present: number; total: number }>;
  isStatsLoading: boolean;
  onBack: () => void;
  onRefresh: () => Promise<void> | void;
}

export type AttendanceFilter = "all" | "highest" | "lowest" | "below75";

export default function ReportsModule({
  students,
  classStats,
  isStatsLoading,
  onBack,
  onRefresh,
}: ReportsModuleProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<AttendanceFilter>("all");

  const blockedCount = students.filter(s => s.isBlocked).length;

  const getStudentStats = (student: Student) => {
    const stats = classStats[student.pid.toUpperCase()];
    const present = stats?.present || 0;
    const total = stats?.total || 0;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    return { present, total, percentage };
  };

  const defaultersCount = useMemo(() => {
    return students.filter((s) => {
      const stats = classStats[s.pid.toUpperCase()];
      const total = stats?.total || 0;
      if (total === 0) return false;
      const percentage = (stats?.present || 0) / total;
      return percentage < 0.75;
    }).length;
  }, [students, classStats]);

  const processedStudents = useMemo(() => {
    let list = students.filter(
      (s) =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.pid.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filterType === "below75") {
      list = list.filter((s) => {
        const { total, percentage } = getStudentStats(s);
        return total > 0 && percentage < 75;
      });
      list.sort((a, b) => getStudentStats(a).percentage - getStudentStats(b).percentage);
    } else if (filterType === "highest") {
      list.sort((a, b) => {
        const aStats = getStudentStats(a);
        const bStats = getStudentStats(b);
        if (bStats.percentage !== aStats.percentage) {
          return bStats.percentage - aStats.percentage;
        }
        if (bStats.present !== aStats.present) {
          return bStats.present - aStats.present;
        }
        return a.pid.localeCompare(b.pid);
      });
    } else if (filterType === "lowest") {
      list.sort((a, b) => {
        const aStats = getStudentStats(a);
        const bStats = getStudentStats(b);
        if (aStats.percentage !== bStats.percentage) {
          return aStats.percentage - bStats.percentage;
        }
        if (aStats.present !== bStats.present) {
          return aStats.present - bStats.present;
        }
        return a.pid.localeCompare(b.pid);
      });
    }

    return list;
  }, [students, searchQuery, filterType, classStats]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Class Report</h2>
          <p className="text-xs text-neutral-400 mt-0.5">Click any student to view details, reset password or block</p>
        </div>
        <button 
          onClick={onBack} 
          className="text-sm font-bold text-neutral-400 hover:text-white bg-neutral-900 px-3.5 py-1.5 rounded-xl border border-neutral-800 transition-colors cursor-pointer"
        >
          Back
        </button>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between shadow-sm">
          <span className="text-[11px] font-semibold text-neutral-400 truncate">Total Enrolled</span>
          <span className="text-sm font-bold text-white mt-1">{students.length}</span>
        </div>
        <div 
          onClick={() => setFilterType(filterType === "below75" ? "all" : "below75")}
          className={`p-3 rounded-xl border flex flex-col justify-between cursor-pointer transition-all shadow-sm ${
            filterType === "below75"
              ? "bg-amber-950/40 border-amber-500/60 shadow-amber-500/10"
              : "bg-neutral-900 border-neutral-800 hover:border-amber-500/30"
          }`}
          title="Click to filter students below 75%"
        >
          <span className="text-[11px] font-semibold text-neutral-400 truncate">&lt; 75% Critical</span>
          <span className={`text-sm font-bold mt-1 ${defaultersCount > 0 ? "text-amber-400" : "text-neutral-400"}`}>
            {defaultersCount}
          </span>
        </div>
        <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col justify-between shadow-sm">
          <span className="text-[11px] font-semibold text-neutral-400 truncate">Blocked Access</span>
          <span className={`text-sm font-bold mt-1 ${blockedCount > 0 ? "text-red-400" : "text-neutral-400"}`}>
            {blockedCount}
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search student by name or PID..."
          className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs placeholder-neutral-500 outline-none focus:border-neutral-600 transition-all font-medium"
        />
      </div>

      {/* Attendance Filter & Sorting Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 mb-4 scrollbar-none">
        <button
          onClick={() => setFilterType("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            filterType === "all"
              ? "bg-white text-black shadow-sm"
              : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white"
          }`}
        >
          Default (PID)
        </button>

        <button
          onClick={() => setFilterType("highest")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            filterType === "highest"
              ? "bg-emerald-500 text-black font-extrabold shadow-sm shadow-emerald-500/20"
              : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-emerald-400 hover:border-emerald-500/30"
          }`}
        >
          <span>Highest Attendance</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <button
          onClick={() => setFilterType("lowest")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            filterType === "lowest"
              ? "bg-red-500 text-white font-extrabold shadow-sm shadow-red-500/20"
              : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-400 hover:border-red-500/30"
          }`}
        >
          <span>Lowest Attendance</span>
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
          </svg>
        </button>

        <button
          onClick={() => setFilterType("below75")}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
            filterType === "below75"
              ? "bg-amber-400 text-black font-extrabold shadow-sm shadow-amber-400/20"
              : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-amber-400 hover:border-amber-500/30"
          }`}
        >
          <span>&lt; 75% Defaulters</span>
          {defaultersCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded text-[10px] font-black ${
                filterType === "below75"
                  ? "bg-black text-amber-400"
                  : "bg-red-500/20 text-red-400 border border-red-500/30"
              }`}
            >
              {defaultersCount}
            </span>
          )}
        </button>
      </div>
      
      {isStatsLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
        </div>
      ) : processedStudents.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
          <p className="text-sm font-bold text-neutral-300">No students match filter</p>
          <p className="text-xs text-neutral-500 mt-1">Try resetting the filter or changing your search query.</p>
          <button
            onClick={() => {
              setFilterType("all");
              setSearchQuery("");
            }}
            className="mt-3 px-3 py-1.5 text-xs font-bold bg-neutral-800 text-neutral-300 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {processedStudents.map((student: Student, index: number) => {
            const { present: presentCount, total: totalCount, percentage } = getStudentStats(student);
            const isGood = percentage >= 75;

            // Blocked students are displayed in light gray / muted neutral tone
            const cardTheme = student.isBlocked
              ? "from-neutral-800/90 to-neutral-900/90 border-neutral-700/80 text-neutral-400 opacity-80"
              : totalCount === 0
              ? "from-neutral-800 to-neutral-900 text-neutral-500 border-neutral-800"
              : isGood
              ? "from-emerald-900/40 to-emerald-950/20 text-emerald-400 border-emerald-500/30 hover:border-emerald-500/50"
              : "from-red-900/40 to-red-950/20 text-red-400 border-red-500/30 hover:border-red-500/50";

            return (
              <div 
                key={student.pid} 
                onClick={() => setSelectedStudent(student)}
                className={`flex justify-between items-center p-4 rounded-2xl border bg-gradient-to-r ${cardTheme} cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] shadow-sm group`}
              >
                <div>
                  <h3 className="font-bold text-white flex items-center gap-2 group-hover:text-amber-300 transition-colors">
                    <span>{student.name}</span>
                    {filterType === "highest" && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300">
                        #{index + 1}
                      </span>
                    )}
                    {filterType === "lowest" && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-red-950/80 border border-red-500/40 text-red-300">
                        #{index + 1}
                      </span>
                    )}
                    {student.isBlocked && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700 uppercase tracking-wider">
                        Blocked by Admin
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-neutral-400 font-medium mt-0.5">{student.pid}</p>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-black">{percentage}%</p>
                  <p className="text-[10px] uppercase font-bold opacity-70 tracking-wider">
                    {presentCount} / {totalCount} Classes
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Student Action & Details Modal */}
      <StudentDetailModal
        isOpen={!!selectedStudent}
        student={selectedStudent}
        stats={selectedStudent ? classStats[selectedStudent.pid.toUpperCase()] : undefined}
        onClose={() => setSelectedStudent(null)}
        onRefresh={async () => {
          await onRefresh();
          setSelectedStudent(null);
        }}
      />
    </div>
  );
}
