"use client";

import React from "react";
import { Assignment } from "@/services/db";

interface AssignmentsModuleProps {
  assignments: Assignment[];
  isAssignmentsLoading: boolean;
  newAssignment: {
    title: string;
    faculty: string;
    subject: string;
    dueDate: string;
    driveUrl: string;
  };
  setNewAssignment: React.Dispatch<React.SetStateAction<{
    title: string;
    faculty: string;
    subject: string;
    dueDate: string;
    driveUrl: string;
  }>>;
  isSubmittingAssignment: boolean;
  handleAddAssignment: (e: React.FormEvent) => void;
  handleDeleteAssignment: (id: string, title: string) => void;
  onBack: () => void;
}

export default function AssignmentsModule({
  assignments,
  isAssignmentsLoading,
  newAssignment,
  setNewAssignment,
  isSubmittingAssignment,
  handleAddAssignment,
  handleDeleteAssignment,
  onBack,
}: AssignmentsModuleProps) {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Manage Assignments</h2>
          <p className="text-xs text-neutral-400 mt-0.5">Add coursework & drive links for students</p>
        </div>
        <button 
          onClick={onBack} 
          className="text-sm font-bold text-neutral-400 hover:text-white bg-neutral-900 px-3.5 py-1.5 rounded-xl border border-neutral-800 transition-colors"
        >
          Back
        </button>
      </div>

      {/* Add Assignment Form */}
      <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <h3 className="font-bold text-white text-sm">Post New Assignment</h3>
          </div>
          <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">Semester Coursework</span>
        </div>
        
        <form onSubmit={handleAddAssignment} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Assignment Name / Title *</label>
            <input
              type="text"
              placeholder="e.g. Data Structures & File I/O"
              value={newAssignment.title}
              onChange={e => setNewAssignment({ ...newAssignment, title: e.target.value })}
              className="w-full p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-medium text-sm transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Subject *</label>
              <input
                type="text"
                placeholder="e.g. Python Programming"
                value={newAssignment.subject}
                onChange={e => setNewAssignment({ ...newAssignment, subject: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-medium text-sm transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Faculty Name *</label>
              <input
                type="text"
                placeholder="e.g. Prof. PPP or PPP"
                value={newAssignment.faculty}
                onChange={e => setNewAssignment({ ...newAssignment, faculty: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-medium text-sm transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Due Date *</label>
            <input
              type="text"
              placeholder="e.g. 25 Sep 2026 or 2026-09-25"
              value={newAssignment.dueDate}
              onChange={e => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
              className="w-full p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-medium text-sm transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Google Drive Link (Optional)</label>
            <input
              type="url"
              placeholder="https://drive.google.com/..."
              value={newAssignment.driveUrl}
              onChange={e => setNewAssignment({ ...newAssignment, driveUrl: e.target.value })}
              className="w-full p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-medium text-sm transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmittingAssignment}
            className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3.5 rounded-xl shadow-[0_0_15px_rgba(225,29,72,0.3)] hover:scale-[1.01] transition-all text-sm mt-2 disabled:opacity-50"
          >
            {isSubmittingAssignment ? "Saving..." : "Add Assignment"}
          </button>
        </form>
      </div>

      {/* Active Assignments List */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-white">Active Assignments</h3>
          <span className="text-xs font-bold text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-lg">
            {assignments.length} {assignments.length === 1 ? "Item" : "Items"}
          </span>
        </div>

        {isAssignmentsLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full"></div>
          </div>
        ) : assignments.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
            <p className="text-sm font-bold text-neutral-300">No assignments entered yet</p>
            <p className="text-xs text-neutral-500 mt-1">Assignments added above will instantly appear here and in the student portal.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {assignments.map(ass => (
              <div
                key={ass.id}
                className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all shadow-sm"
              >
                <div className="flex justify-between items-start mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      {ass.subject}
                    </span>
                    <span className="text-xs font-bold text-neutral-400">
                      {ass.faculty?.startsWith("Prof.") ? ass.faculty : `Prof. ${ass.faculty}`}
                    </span>
                  </div>
                  <button
                    onClick={() => ass.id && handleDeleteAssignment(ass.id, ass.title)}
                    className="text-red-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-950/50 transition-colors"
                    title="Delete Assignment"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <h4 className="font-bold text-white text-sm">{ass.title}</h4>

                <div className="flex justify-between items-center mt-3 pt-3 border-t border-neutral-800/60 text-xs text-neutral-400">
                  <div>
                    Due: <strong className="text-neutral-200">{ass.dueDate}</strong>
                  </div>
                  {ass.driveUrl ? (
                    <a
                      href={ass.driveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1"
                    >
                      <span>Drive Link</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  ) : (
                    <span className="text-neutral-500 text-[11px]">No link</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
