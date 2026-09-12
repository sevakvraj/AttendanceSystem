"use client";

import React, { useState } from "react";
import { Student } from "@/services/db";
import StudentDetailModal from "./StudentDetailModal";

interface ReportsModuleProps {
  students: Student[];
  classStats: Record<string, { present: number; total: number }>;
  isStatsLoading: boolean;
  onBack: () => void;
  onRefresh: () => Promise<void> | void;
}

export default function ReportsModule({
  students,
  classStats,
  isStatsLoading,
  onBack,
  onRefresh,
}: ReportsModuleProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const blockedCount = students.filter(s => s.isBlocked).length;

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.pid.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-white">Class Report</h2>
          <p className="text-xs text-neutral-400 mt-0.5">Click any student to view details, reset password or block</p>
        </div>
        <button 
          onClick={onBack} 
          className="text-sm font-bold text-neutral-400 hover:text-white bg-neutral-900 px-3.5 py-1.5 rounded-xl border border-neutral-800 transition-colors"
        >
          Back
        </button>
      </div>

      {/* Summary Chips */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex justify-between items-center">
          <span className="text-xs font-semibold text-neutral-400">Total Enrolled</span>
          <span className="text-sm font-bold text-white">{students.length}</span>
        </div>
        <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 flex justify-between items-center">
          <span className="text-xs font-semibold text-neutral-400">Blocked Access</span>
          <span className={`text-sm font-bold ${blockedCount > 0 ? "text-red-400" : "text-neutral-400"}`}>
            {blockedCount}
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
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
      
      {isStatsLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
          <p className="text-sm font-bold text-neutral-300">No students found</p>
          <p className="text-xs text-neutral-500 mt-1">Try a different search query.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStudents.map((student) => {
            const stats = classStats[student.pid.toUpperCase()];
            const presentCount = stats?.present || 0;
            const totalCount = stats?.total || 0;
            const percentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
            
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
