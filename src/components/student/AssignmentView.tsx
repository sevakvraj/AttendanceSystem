"use client";

import React, { useEffect, useState } from "react";
import { getAssignments, Assignment } from "@/services/db";
import { DRIVE_MATERIAL_URL } from "./DashboardGrid";

interface AssignmentViewProps {
  onBack: () => void;
}

export default function AssignmentView({ onBack }: AssignmentViewProps) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchAssignments() {
      try {
        const data = await getAssignments();
        setAssignments(data);
      } catch (error) {
        console.error("Error loading assignments:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchAssignments();
  }, []);

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
        <span className="text-xs font-black uppercase tracking-wider text-rose-400">
          Semester Assignments
        </span>
      </div>

      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-white font-extrabold text-lg tracking-tight">MCA-I Coursework</h2>
          <p className="text-neutral-500 text-xs font-bold mt-0.5">Track and view semester submissions</p>
        </div>
        <div className="bg-rose-950/40 border border-rose-800/50 px-3 py-1 rounded-lg text-xs font-bold text-rose-400">
          {isLoading ? "..." : `${assignments.length} Tasks`}
        </div>
      </div>

      {/* Assignment cards or Loading / Empty state */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-3">
          <div className="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full"></div>
          <p className="text-xs font-bold text-neutral-500">Loading assignments...</p>
        </div>
      ) : assignments.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-neutral-900/60 border border-neutral-800/80 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-neutral-800/80 flex items-center justify-center text-neutral-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-200">No Assignments Found</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
              No coursework or assignments have been posted by faculty yet. Please check back later.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((ass) => {
            const driveLink = ass.driveUrl && ass.driveUrl.trim() ? ass.driveUrl.trim() : DRIVE_MATERIAL_URL;
            return (
              <div
                key={ass.id}
                className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      {ass.subject}
                    </span>
                    <span className="text-xs font-bold text-neutral-400">
                      {ass.faculty?.startsWith("Prof.") ? ass.faculty : `Prof. ${ass.faculty}`}
                    </span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    Active
                  </span>
                </div>

                <h3 className="font-bold text-white text-sm">{ass.title}</h3>

                <div className="flex justify-between items-center mt-3 pt-3 border-t border-neutral-800/60">
                  <div className="text-[11px] text-neutral-400 flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Due: <strong className="text-neutral-200">{ass.dueDate}</strong></span>
                  </div>

                  <button
                    onClick={() => window.open(driveLink, "_blank", "noopener,noreferrer")}
                    className="text-[11px] font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1"
                  >
                    <span>View Drive</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
