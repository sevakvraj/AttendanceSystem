"use client";

import React from "react";
import { Student } from "@/services/db";

interface RollCallModuleProps {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  isCalendarOpen: boolean;
  setIsCalendarOpen: (open: boolean) => void;
  formattedDate: string;
  renderCalendar: () => React.ReactNode;
  availableLectures: string[];
  selectedLecture: string;
  setSelectedLecture: (lecture: string) => void;
  isCancelled: boolean;
  handleCancelLecture: () => void;
  markAll: (status: "PRESENT" | "ABSENT") => void;
  markStudent: (pid: string, status: "PRESENT" | "ABSENT") => void;
  search: string;
  setSearch: (query: string) => void;
  filteredStudents: Student[];
  allStudents: Student[];
  handleSaveAttendance: () => Promise<void> | void;
  isSavingAttendance: boolean;
  hasUnsavedChanges: boolean;
  saveSuccessMessage: string;
}

export default function RollCallModule({
  currentDate,
  setCurrentDate,
  isCalendarOpen,
  setIsCalendarOpen,
  formattedDate,
  renderCalendar,
  availableLectures,
  selectedLecture,
  setSelectedLecture,
  isCancelled,
  handleCancelLecture,
  markAll,
  markStudent,
  search,
  setSearch,
  filteredStudents,
  allStudents,
  handleSaveAttendance,
  isSavingAttendance,
  hasUnsavedChanges,
  saveSuccessMessage,
}: RollCallModuleProps) {
  const presentCount = allStudents.filter(s => s.status === "PRESENT").length;
  const absentCount = allStudents.filter(s => s.status === "ABSENT").length;
  const unmarkedCount = allStudents.filter(s => !s.status || s.status === "UNMARKED").length;

  return (
    <div>
      {/* Calendar & Lecture Selector Banner */}
      <div className="px-6 pt-2 pb-4">
        <div className={`bg-neutral-950 border ${isCancelled ? 'border-red-900/40' : 'border-neutral-800'} rounded-2xl p-4 shadow-xl text-white transition-all relative`}>
          <div 
            className="flex justify-between items-center mb-3 pb-3 border-b border-neutral-800 cursor-pointer hover:bg-neutral-900 rounded-lg p-2"
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          >
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h2 className="font-bold text-white">{formattedDate}</h2>
            </div>
            <svg className={`w-4 h-4 text-neutral-500 transition-transform ${isCalendarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          {/* Modern Calendar Dropdown */}
          {isCalendarOpen && (
            <div className="mb-4 bg-neutral-950 border border-neutral-800 rounded-xl p-3 shadow-inner">
              <div className="flex justify-between items-center mb-2 px-1">
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)); 
                  }} 
                  className="text-neutral-500 hover:text-white p-1"
                  title="Previous Month"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-sm text-white">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCurrentDate(new Date());
                      setIsCalendarOpen(false);
                    }}
                    className="text-[10px] font-bold text-amber-400 bg-amber-950/50 border border-amber-500/40 px-2 py-0.5 rounded-full hover:bg-amber-900/60 transition-colors shadow-sm cursor-pointer"
                    title="Jump to Today"
                  >
                    Today
                  </button>
                </div>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)); 
                  }} 
                  className="text-neutral-500 hover:text-white p-1"
                  title="Next Month"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-neutral-600 mb-2">
                <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
              </div>
              <div className="grid grid-cols-7 gap-1">
                {renderCalendar()}
              </div>
              
              {/* Legend */}
              <div className="mt-3 flex space-x-3 text-[10px] font-bold text-neutral-500 justify-center">
                <div className="flex items-center"><span className="w-2 h-2 rounded-full border border-amber-400 bg-amber-400/30 mr-1"></span> Today</div>
                <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span> Holiday</div>
                <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500/20 border border-red-500/50 mr-1"></span> Sunday</div>
              </div>
            </div>
          )}
          
          <div className="relative">
            <select 
              disabled={availableLectures.length === 0} 
              value={selectedLecture} 
              onChange={e => setSelectedLecture(e.target.value)} 
              className={`w-full bg-neutral-900 border ${isCancelled ? 'border-red-600/60 text-red-300' : availableLectures.length === 0 ? 'border-red-900/50 text-red-500' : 'border-neutral-800 text-white'} rounded-xl px-4 py-3 text-sm font-bold outline-none disabled:opacity-50 appearance-none shadow-inner focus:border-neutral-600 transition-colors`}
            >
              {availableLectures.length === 0 ? (
                <option value="">No lectures scheduled</option>
              ) : (
                availableLectures.map((lecture, idx) => (
                  <option key={idx} value={lecture}>{lecture}</option>
                ))
              )}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-neutral-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Roll Call Body */}
      <div className="p-6 pt-0 space-y-4">
        {availableLectures.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-blue-950/30 border border-blue-900/50 rounded-full flex items-center justify-center mb-6 text-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Holiday / Weekend</h3>
            <p className="text-neutral-500 text-sm font-medium max-w-[250px]">
              Relax and enjoy your day off. No classes are scheduled for today!
            </p>
          </div>
        ) : (
          <>
            {/* Quick Actions (Mark All Present & Cancel Lecture) */}
            <div className="flex space-x-3">
              <button 
                disabled={isCancelled} 
                onClick={() => markAll("PRESENT")} 
                className="flex-1 bg-white hover:bg-neutral-200 text-black font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95 text-sm disabled:opacity-30 disabled:grayscale"
              >
                Mark All Present
              </button>
              <button 
                onClick={handleCancelLecture} 
                className={`flex-1 font-bold py-3 rounded-xl transition-all active:scale-95 text-sm ${isCancelled ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800'}`}
              >
                {isCancelled ? 'Undo Cancel' : 'Cancel Lecture'}
              </button>
            </div>

            {/* Attendance Tally Bar */}
            {!isCancelled && (
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-center text-xs">
                <div className="p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-800/40">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">Present</span>
                  <strong className="text-sm font-black text-emerald-300">{presentCount}</strong>
                </div>
                <div className="p-1.5 rounded-lg bg-red-950/40 border border-red-800/40">
                  <span className="text-[10px] uppercase font-bold text-red-400 block">Absent</span>
                  <strong className="text-sm font-black text-red-300">{absentCount}</strong>
                </div>
                <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Pending</span>
                  <strong className="text-sm font-black text-neutral-300">{unmarkedCount}</strong>
                </div>
              </div>
            )}

            {/* Success Toast / Notification */}
            {saveSuccessMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/80 text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)] animate-in fade-in slide-in-from-top-2">
                <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{saveSuccessMessage}</span>
              </div>
            )}

            {/* Unsaved Changes Alert Banner */}
            {hasUnsavedChanges && !saveSuccessMessage && !isCancelled && (
              <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-300 text-xs font-medium flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  <span>Unsaved changes in local view</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-bold bg-amber-500/20 px-2 py-0.5 rounded text-amber-300">
                  Click Update Below
                </span>
              </div>
            )}

            {isCancelled ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center bg-neutral-900/30 border border-red-900/30 rounded-2xl">
                <div className="w-16 h-16 bg-red-950/40 border border-red-900/60 rounded-full flex items-center justify-center mb-4 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-1">This Lecture is Cancelled</h3>
                <p className="text-red-400 font-bold text-xs mb-2">Slot: {selectedLecture}</p>
                <p className="text-neutral-400 text-xs font-medium max-w-xs">
                  This specific lecture slot is marked as cancelled. Other lecture slots for this day are unaffected. You can switch to another lecture slot from the dropdown above or click &apos;Undo Cancel&apos;.
                </p>
              </div>
            ) : (
              <>
                {/* Search Bar */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input 
                    type="text" 
                    value={search} 
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-neutral-800 focus:border-white focus:ring-1 focus:ring-white outline-none transition-all bg-neutral-900 text-white shadow-sm font-medium placeholder-neutral-600 text-sm"
                    placeholder="Search student..."
                  />
                </div>

                {/* Student Checklist */}
                <div className="space-y-2.5">
                  {filteredStudents.map((student) => (
                    <div 
                      key={student.pid} 
                      className={`flex justify-between items-center p-3.5 rounded-2xl border transition-all ${
                        student.status === "PRESENT" 
                          ? "border-emerald-500/50 bg-emerald-950/20" 
                          : student.status === "ABSENT" 
                          ? "border-red-500/50 bg-red-950/20" 
                          : "border-neutral-800 bg-neutral-900"
                      }`}
                    >
                      <div>
                        <h3 className={`font-bold flex items-center text-sm ${
                          student.status === "PRESENT" 
                            ? "text-emerald-400" 
                            : student.status === "ABSENT" 
                            ? "text-red-400" 
                            : "text-white"
                        }`}>
                          <span>{student.name}</span>
                          {student.isBlocked && (
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700 ml-2">
                              Blocked
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-neutral-500 font-medium">{student.pid}</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => markStudent(student.pid, "PRESENT")} 
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                            student.status === "PRESENT" 
                              ? "bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]" 
                              : "bg-neutral-950 border border-neutral-800 text-neutral-500 hover:bg-emerald-950 hover:text-emerald-500 hover:border-emerald-900"
                          }`}
                          title="Mark Present"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => markStudent(student.pid, "ABSENT")} 
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                            student.status === "ABSENT" 
                              ? "bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.3)]" 
                              : "bg-neutral-950 border border-neutral-800 text-neutral-500 hover:bg-red-950 hover:text-red-500 hover:border-red-900"
                          }`}
                          title="Mark Absent"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* FINAL UPDATE ATTENDANCE BUTTON (Only uploads when clicked!) */}
                <div className="sticky bottom-0 pt-4 pb-2 bg-gradient-to-t from-neutral-950 via-neutral-950/95 to-transparent z-10">
                  <button
                    onClick={handleSaveAttendance}
                    disabled={isSavingAttendance || availableLectures.length === 0}
                    className={`w-full py-4 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl active:scale-[0.99] ${
                      hasUnsavedChanges
                        ? "bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-400 text-neutral-950 shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:brightness-110"
                        : "bg-white hover:bg-neutral-200 text-neutral-950 shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    {isSavingAttendance ? (
                      <>
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        <span>Updating Attendance to Database...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span>Update Attendance to Database</span>
                        {hasUnsavedChanges && (
                          <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-neutral-950/20 text-neutral-950">
                            Pending
                          </span>
                        )}
                      </>
                    )}
                  </button>
                  <p className="text-[10px] text-center text-neutral-500 font-medium mt-1.5">
                    Click to commit and sync this lecture&apos;s attendance to the student portal
                  </p>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
