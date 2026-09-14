"use client";

import React, { useState, useMemo, useEffect } from "react";
import { HOLIDAYS_2026 } from "@/lib/constants";
import { getCustomSlots, CustomSlot } from "@/services/db";

export interface SubjectStat {
  id: string;
  name: string;
  present: number;
  total: number;
  faculties?: Record<string, { present: number; total: number }>;
}

export const FACULTY_NAMES: Record<string, string> = {
  AAP: "Prof. AAP",
  PPP: "Prof. PPP",
  TMS: "Prof. TMS",
  VLD: "Prof. VLD",
  LSL: "Prof. LSL",
  JVS: "Prof. JVS",
  LAB: "Lab Faculty",
};

export const SUBJECT_DEFAULT_FACULTIES: Record<string, string[]> = {
  "Python": ["PPP"],
  "Python Programming": ["PPP"],
  "Computer Network": ["TMS", "AAP"],
  "DBMS": ["JVS", "PPP"],
  "Operating System": ["LSL", "VLD"],
  "Computer Fundamental": ["AAP"],
  "Practical Lab": ["LAB"],
};

interface AttendanceRecord {
  date: string;
  lecture: string;
  subject: string;
  faculty: string;
  status: "PRESENT" | "ABSENT";
  isCancelled?: boolean;
}

interface AttendanceViewProps {
  subjects: SubjectStat[];
  attendanceHistory: AttendanceRecord[];
  totalClasses: number;
  totalPresent: number;
  overallPercentage: string;
  isLoading: boolean;
  onBack: () => void;
}

interface SlotSchedule {
  time: string;
  timeRange: string;
  subject: string;
  code: string;
  faculty: string;
  type: "Lab" | "Lecture";
}

interface SlotModalData {
  dateFormatted: string;
  timeSlot: string;
  slotType: "Lab" | "Lecture" | "Holiday" | "None";
  subjectName: string;
  facultyName: string;
  status: string;
}

// Master Timetable definition for Monday to Saturday
const TIMETABLE_SLOTS: Record<number, (SlotSchedule | null)[]> = {
  // Monday (1)
  1: [
    { time: "10:30", timeRange: "10:30 AM to 12:30 PM", subject: "Practical Lab", code: "LAB", faculty: "Lab Faculty", type: "Lab" },
    { time: "12:30", timeRange: "12:30 PM to 1:30 PM", subject: "Computer Fundamental", code: "C55", faculty: "Prof. AAP", type: "Lecture" },
    { time: "2:30", timeRange: "2:30 PM to 3:30 PM", subject: "Python Programming", code: "C51", faculty: "Prof. PPP", type: "Lecture" },
    { time: "3:30", timeRange: "3:30 PM to 4:30 PM", subject: "Operating System", code: "C54", faculty: "Prof. LSL", type: "Lecture" },
    { time: "4:30", timeRange: "4:30 PM to 5:30 PM", subject: "Computer Network", code: "C52", faculty: "Prof. TMS", type: "Lecture" },
    null,
  ],
  // Tuesday (2)
  2: [
    { time: "10:30", timeRange: "10:30 AM to 12:30 PM", subject: "Practical Lab", code: "LAB", faculty: "Lab Faculty", type: "Lab" },
    { time: "12:30", timeRange: "12:30 PM to 1:30 PM", subject: "Computer Fundamental", code: "C55", faculty: "Prof. AAP", type: "Lecture" },
    { time: "2:30", timeRange: "2:30 PM to 3:30 PM", subject: "Python Programming", code: "C51", faculty: "Prof. PPP", type: "Lecture" },
    { time: "3:30", timeRange: "3:30 PM to 4:30 PM", subject: "Operating System", code: "C54", faculty: "Prof. LSL", type: "Lecture" },
    { time: "4:30", timeRange: "4:30 PM to 5:30 PM", subject: "Computer Network", code: "C52", faculty: "Prof. AAP", type: "Lecture" },
    null,
  ],
  // Wednesday (3)
  3: [
    { time: "10:30", timeRange: "10:30 AM to 12:30 PM", subject: "Practical Lab", code: "LAB", faculty: "Lab Faculty", type: "Lab" },
    { time: "12:30", timeRange: "12:30 PM to 1:30 PM", subject: "Operating System", code: "C54", faculty: "Prof. VLD", type: "Lecture" },
    { time: "2:30", timeRange: "2:30 PM to 3:30 PM", subject: "DBMS", code: "C53", faculty: "Prof. JVS", type: "Lecture" },
    { time: "3:30", timeRange: "3:30 PM to 4:30 PM", subject: "Python Programming", code: "C51", faculty: "Prof. PPP", type: "Lecture" },
    { time: "4:30", timeRange: "4:30 PM to 5:30 PM", subject: "Computer Network", code: "C52", faculty: "Prof. AAP", type: "Lecture" },
    null,
  ],
  // Thursday (4)
  4: [
    { time: "10:30", timeRange: "10:30 AM to 12:30 PM", subject: "Practical Lab", code: "LAB", faculty: "Lab Faculty", type: "Lab" },
    { time: "12:30", timeRange: "12:30 PM to 1:30 PM", subject: "Operating System", code: "C54", faculty: "Prof. VLD", type: "Lecture" },
    { time: "2:30", timeRange: "2:30 PM to 3:30 PM", subject: "DBMS", code: "C53", faculty: "Prof. JVS", type: "Lecture" },
    { time: "3:30", timeRange: "3:30 PM to 4:30 PM", subject: "Python Programming", code: "C51", faculty: "Prof. PPP", type: "Lecture" },
    null,
    null,
  ],
  // Friday (5)
  5: [
    { time: "10:30", timeRange: "10:30 AM to 12:30 PM", subject: "Practical Lab", code: "LAB", faculty: "Lab Faculty", type: "Lab" },
    { time: "12:30", timeRange: "12:30 PM to 1:30 PM", subject: "Computer Network", code: "C52", faculty: "Prof. TMS", type: "Lecture" },
    { time: "2:30", timeRange: "2:30 PM to 3:30 PM", subject: "DBMS", code: "C53", faculty: "Prof. PPP", type: "Lecture" },
    { time: "3:30", timeRange: "3:30 PM to 4:30 PM", subject: "Computer Fundamental", code: "C55", faculty: "Prof. AAP", type: "Lecture" },
    null,
    null,
  ],
  // Saturday (6)
  6: [
    { time: "10:30", timeRange: "10:30 AM to 12:30 PM", subject: "Practical Lab", code: "LAB", faculty: "Lab Faculty", type: "Lab" },
    { time: "12:30", timeRange: "12:30 PM to 1:30 PM", subject: "Computer Fundamental", code: "C55", faculty: "Prof. AAP", type: "Lecture" },
    { time: "2:30", timeRange: "2:30 PM to 3:30 PM", subject: "DBMS", code: "C53", faculty: "Prof. PPP", type: "Lecture" },
    null,
    null,
    null,
  ],
};

export default function AttendanceView({
  subjects,
  attendanceHistory,
  totalClasses,
  totalPresent,
  overallPercentage,
  isLoading,
  onBack,
}: AttendanceViewProps) {
  const [tab, setTab] = useState<"subject" | "day">("day");
  const [selectedModal, setSelectedModal] = useState<SlotModalData | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<SubjectStat | null>(null);
  const [customSlots, setCustomSlots] = useState<CustomSlot[]>([]);

  useEffect(() => {
    getCustomSlots()
      .then(setCustomSlots)
      .catch((err) => console.error("Error loading custom slots in AttendanceView:", err));
  }, []);

  const DAY_INDEX_MAP: Record<number, string> = {
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };

  const getSlotsForDay = (dayOfWeek: number, dateStr?: string): (SlotSchedule | null)[] => {
    const baseSlots = [...(TIMETABLE_SLOTS[dayOfWeek] || [null, null, null, null, null, null])];
    const dayName = DAY_INDEX_MAP[dayOfWeek];
    if (!dayName) return baseSlots;

    const matchingCustom = customSlots.filter((s) => {
      if (s.date && dateStr) return s.date === dateStr;
      return s.day === dayName;
    });

    if (matchingCustom.length === 0) return baseSlots;

    const merged = [...baseSlots];
    matchingCustom.forEach((cs) => {
      const converted: SlotSchedule = {
        time: cs.timeStart || cs.time.split(" ")[0],
        timeRange: cs.time,
        subject: cs.subject,
        code: cs.code,
        faculty: cs.faculty,
        type: cs.type,
      };

      const firstNullIdx = merged.indexOf(null);
      if (firstNullIdx !== -1) {
        merged[firstNullIdx] = converted;
      } else {
        merged.push(converted);
      }
    });

    return merged;
  };

  // Compute faculty-wise statistics for selected subject
  const facultyBreakdown = useMemo(() => {
    if (!selectedSubject) return [];

    const defaultList =
      SUBJECT_DEFAULT_FACULTIES[selectedSubject.name] ||
      SUBJECT_DEFAULT_FACULTIES[selectedSubject.id] ||
      [];
    const recordedFaculties = Object.keys(selectedSubject.faculties || {});
    const allKeys = Array.from(new Set([...defaultList, ...recordedFaculties]));

    return allKeys.map((facKey) => {
      const stat = selectedSubject.faculties?.[facKey] || { present: 0, total: 0 };
      const name = FACULTY_NAMES[facKey] || facKey;
      const percentage = stat.total > 0 ? (stat.present / stat.total) * 100 : 0;
      return {
        key: facKey,
        name,
        present: stat.present,
        total: stat.total,
        percentage,
      };
    });
  }, [selectedSubject]);

  // Generate all calendar dates starting from August 3, 2026 strictly up to system date (today), excluding Sundays (unless attendance was recorded)
  const allDaysList = useMemo(() => {
    const startDate = new Date(2026, 7, 3); // 03 Aug 2026 (Semester Start)
    const sysDate = new Date();
    // System date (today) in local time
    let maxDate = new Date(sysDate.getFullYear(), sysDate.getMonth(), sysDate.getDate());

    // Also include any dates from attendanceHistory if they are beyond maxDate
    attendanceHistory.forEach((r) => {
      if (r.date) {
        const [ry, rm, rd] = r.date.split("-").map(Number);
        const rDate = new Date(ry, rm - 1, rd);
        if (rDate > maxDate) {
          maxDate = rDate;
        }
      }
    });

    const dates: string[] = [];
    const curr = new Date(maxDate);
    while (curr >= startDate) {
      const yyyy = curr.getFullYear();
      const mm = String(curr.getMonth() + 1).padStart(2, "0");
      const dd = String(curr.getDate()).padStart(2, "0");
      const dateStr = `${yyyy}-${mm}-${dd}`;

      // Exclude Sunday (day 0) unless attendance was recorded on that Sunday
      if (curr.getDay() !== 0 || attendanceHistory.some((r) => r.date === dateStr)) {
        dates.push(dateStr);
      }
      curr.setDate(curr.getDate() - 1);
    }
    return dates;
  }, [attendanceHistory]);

  const handleSlotClick = (dateStr: string, idx: number) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    const dayOfWeek = dateObj.getDay();
    const holiday = HOLIDAYS_2026[dateStr];
    const dayRecords = attendanceHistory.filter((r) => r.date === dateStr);
    const slotsForDay = getSlotsForDay(dayOfWeek, dateStr);
    const schedule = slotsForDay[idx] || null;

    const dateFormatted = `${String(d).padStart(2, "0")}-${String(m).padStart(2, "0")}-${y}`;

    let status: string = "-";
    let isCancelledLecture = false;

    if (holiday) {
      status = "-";
    } else if (schedule) {
      const rec = dayRecords.find(
        (r) =>
          r.lecture.includes(schedule.time) ||
          (schedule.subject &&
            r.subject &&
            (r.subject.toLowerCase().includes(schedule.subject.toLowerCase()) ||
              schedule.subject.toLowerCase().includes(r.subject.toLowerCase())))
      );
      if (rec) {
        if (rec.isCancelled) {
          status = "CANCELLED";
          isCancelledLecture = true;
        } else {
          status = rec.status === "PRESENT" ? "P" : "A";
        }
      } else {
        status = "PN";
      }
    }

    if (holiday) {
      setSelectedModal({
        dateFormatted,
        timeSlot: "Academic Holiday",
        slotType: "Holiday",
        subjectName: `Holiday: ${holiday}`,
        facultyName: "Academic Calendar 2026",
        status: "-",
      });
    } else if (schedule) {
      setSelectedModal({
        dateFormatted,
        timeSlot: schedule.timeRange,
        slotType: schedule.type,
        subjectName: `${schedule.subject} (${schedule.code})`,
        facultyName: schedule.faculty,
        status,
      });
    } else {
      setSelectedModal({
        dateFormatted,
        timeSlot: `Slot ${idx + 1}`,
        slotType: "None",
        subjectName: "No Lecture / Lab",
        facultyName: "Not Scheduled",
        status: "-",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* View Header with Back button */}
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
          Attendance Detail
        </span>
      </div>

      {/* Segmented Tabs */}
      <div className="bg-teal-950/40 p-1.5 rounded-2xl border border-teal-800/40 flex gap-2 shadow-inner">
        <button
          onClick={() => setTab("subject")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
            tab === "subject"
              ? "bg-teal-600 text-white shadow-md shadow-teal-950/50"
              : "text-teal-400 hover:text-white"
          }`}
        >
          Subject Wise
        </button>
        <button
          onClick={() => setTab("day")}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
            tab === "day"
              ? "bg-teal-600 text-white shadow-md shadow-teal-950/50"
              : "text-teal-400 hover:text-white"
          }`}
        >
          Day Wise
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-36">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
        </div>
      ) : tab === "subject" ? (
        <div>
          {/* Semester & Academic Year Sub-banner */}
          <div className="flex justify-between items-center px-1 mb-3">
            <span className="bg-neutral-900 text-white border border-neutral-800 text-xs font-bold px-3 py-1 rounded-md shadow-sm">
              Sem-1
            </span>
            <span className="text-xs font-semibold text-neutral-400">
              A.Y. 2026-27
            </span>
          </div>

          {/* GNUMS Subject Wise Table */}
          <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead className="bg-neutral-800/80 border-b border-neutral-800">
                <tr>
                  <th className="p-3 text-xs font-bold text-neutral-300 border-r border-neutral-800/60">Course</th>
                  <th className="p-2 text-center text-[10px] font-bold text-neutral-400 leading-tight border-r border-neutral-800/60">Total<br/>(Lect/Lab)</th>
                  <th className="p-2 text-center text-[10px] font-bold text-neutral-400 leading-tight border-r border-neutral-800/60">Present<br/>(Lect/Lab)</th>
                  <th className="p-2 text-right text-[10px] font-bold text-neutral-400 leading-tight">Attendance<br/>(%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {subjects.map((sub) => {
                  const perc = sub.total === 0 ? 0 : (sub.present / sub.total) * 100;
                  const isWarning = perc < 75;

                  return (
                    <tr
                      key={sub.id}
                      onClick={() => setSelectedSubject(sub)}
                      className="hover:bg-neutral-800/50 active:bg-neutral-800/80 cursor-pointer transition-colors group"
                      title="Click to view faculty-wise breakdown and slanted bargraph"
                    >
                      <td className="p-3 border-r border-neutral-800/60">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-white block leading-snug group-hover:text-teal-300 transition-colors">
                            {sub.id} - {sub.name}
                          </span>
                          <span className="text-[10px] text-teal-400/80 font-medium group-hover:text-teal-300 group-hover:translate-x-0.5 transition-all flex items-center gap-0.5 shrink-0">
                            Faculty
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      </td>
                      <td className="p-2 text-center text-xs font-semibold text-neutral-300 border-r border-neutral-800/60">{sub.total}</td>
                      <td className="p-2 text-center text-xs font-semibold text-neutral-300 border-r border-neutral-800/60">{sub.present}</td>
                      <td className={`p-2 text-right text-xs font-bold ${isWarning ? 'text-red-400' : 'text-emerald-400'}`}>
                        {perc.toFixed(2)}%
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="bg-neutral-800/50 border-t border-neutral-800 font-bold">
                  <td className="p-3 text-right text-xs font-black text-white uppercase tracking-wider border-r border-neutral-800/60">Total</td>
                  <td className="p-2 text-center text-xs font-black text-white border-r border-neutral-800/60">{totalClasses}</td>
                  <td className="p-2 text-center text-xs font-black text-white border-r border-neutral-800/60">{totalPresent}</td>
                  <td className="p-2 text-right text-xs font-black text-emerald-400">{overallPercentage}%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      ) : (
        /* GNUMS Day Wise View */
        <div>
          {/* Legend matching GNUMS & User photo */}
          <div className="text-[11px] font-medium text-neutral-400 px-1 mb-2.5 leading-relaxed">
            <span className="text-emerald-400 font-bold">P</span> = Present , <span className="text-red-500 font-bold">A</span> = Absent , <span className="text-amber-400 font-bold">PN</span> = Pending , <span className="text-purple-400 font-bold">C</span> = Cancelled , <span className="text-neutral-500 font-bold">-</span> = No Lecture/Lab
          </div>

          {/* Table container - Clean dark borders, uniform sleek look */}
          <div className="bg-neutral-950 rounded-2xl border border-neutral-800 overflow-hidden shadow-sm">
            <table className="w-full table-fixed border-collapse">
              <colgroup>
                <col className="w-[22%]" />
                <col className="w-[13%]" />
                <col className="w-[13%]" />
                <col className="w-[13%]" />
                <col className="w-[13%]" />
                <col className="w-[13%]" />
                <col className="w-[13%]" />
              </colgroup>
              <thead className="bg-neutral-900 border-b border-neutral-800">
                <tr>
                  <th className="p-2 text-center text-[11px] font-bold text-neutral-300 border-r border-neutral-800">Date</th>
                  <th className="p-1.5 text-center text-[10px] font-bold text-neutral-400 border-r border-neutral-800">Slot<br/>1</th>
                  <th className="p-1.5 text-center text-[10px] font-bold text-neutral-400 border-r border-neutral-800">Slot<br/>2</th>
                  <th className="p-1.5 text-center text-[10px] font-bold text-neutral-400 border-r border-neutral-800">Slot<br/>3</th>
                  <th className="p-1.5 text-center text-[10px] font-bold text-neutral-400 border-r border-neutral-800">Slot<br/>4</th>
                  <th className="p-1.5 text-center text-[10px] font-bold text-neutral-400 border-r border-neutral-800">Slot<br/>5</th>
                  <th className="p-1.5 text-center text-[10px] font-bold text-neutral-400">Slot<br/>6</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/80">
                {allDaysList.map((dateStr) => {
                  const [y, m, d] = dateStr.split("-").map(Number);
                  const dateObj = new Date(y, m - 1, d);
                  const dayOfWeek = dateObj.getDay();
                  const holiday = HOLIDAYS_2026[dateStr];
                  const dayRecords = attendanceHistory.filter((r) => r.date === dateStr);
                  const slotsForDay = getSlotsForDay(dayOfWeek, dateStr);

                  const dayName = dateObj.toLocaleDateString("en-GB", { weekday: "short" });
                  const formattedDayMonth = dateObj.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }).replace(" ", "-");
                  const now = new Date();
                  const isToday =
                    dateObj.getDate() === now.getDate() &&
                    dateObj.getMonth() === now.getMonth() &&
                    dateObj.getFullYear() === now.getFullYear();

                  return (
                    <tr key={dateStr} className={`hover:bg-neutral-900/60 transition-colors ${isToday ? 'bg-teal-950/20' : ''}`}>
                      {/* Date column */}
                      <td className={`p-2 border-r border-neutral-800 text-center whitespace-nowrap ${isToday ? 'bg-teal-950/40' : 'bg-neutral-950/40'}`}>
                        <div className="flex items-center justify-center gap-1">
                          <span className={`block text-[11px] font-bold leading-tight ${isToday ? 'text-teal-300' : 'text-neutral-200'}`}>
                            {formattedDayMonth}
                          </span>
                          {isToday && (
                            <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-teal-500/20 text-teal-300 border border-teal-500/40">
                              Today
                            </span>
                          )}
                        </div>
                        <span className={`block text-[10px] font-medium mt-0.5 ${isToday ? 'text-teal-400/80' : 'text-neutral-500'}`}>
                          {dayName}
                        </span>
                      </td>

                      {/* 6 Slots */}
                      {[0, 1, 2, 3, 4, 5].map((slotIdx) => {
                        const schedule = slotsForDay[slotIdx] || null;
                        let status: string = "-";

                        if (holiday) {
                          status = "-";
                        } else if (schedule) {
                          const rec = dayRecords.find(
                            (r) =>
                              r.lecture.includes(schedule.time) ||
                              (schedule.subject &&
                                r.subject &&
                                (r.subject.toLowerCase().includes(schedule.subject.toLowerCase()) ||
                                  schedule.subject.toLowerCase().includes(r.subject.toLowerCase())))
                          );
                          if (rec) {
                            if (rec.isCancelled) {
                              status = "C";
                            } else {
                              status = rec.status === "PRESENT" ? "P" : "A";
                            }
                          } else {
                            status = "PN";
                          }
                        } else {
                          status = "-";
                        }

                        // Clean, high-contrast text color for the letter
                        const textColor =
                          status === "P"
                            ? "text-emerald-400"
                            : status === "A"
                            ? "text-red-500"
                            : status === "PN"
                            ? "text-amber-400"
                            : status === "C"
                            ? "text-purple-400"
                            : "text-neutral-600";

                        return (
                          <td
                            key={slotIdx}
                            onClick={() => handleSlotClick(dateStr, slotIdx)}
                            className="p-1.5 text-center border-r border-neutral-800 last:border-0 cursor-pointer select-none transition-all active:scale-90 hover:bg-neutral-800/50"
                            title={
                              status === "P"
                                ? "Present - Click for details"
                                : status === "A"
                                ? "Absent - Click for details"
                                : status === "PN"
                                ? "Attendance Pending - Click for details"
                                : status === "C"
                                ? "Cancelled Lecture - Click for details"
                                : "No Lecture / Lab"
                            }
                          >
                            <span className={`text-xs font-bold inline-block ${textColor}`}>
                              {status}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Lecture Detail Popup / Bottom Sheet (Matching photo 2) */}
      {selectedModal && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-end justify-center animate-in fade-in duration-150"
          onClick={() => setSelectedModal(null)}
        >
          <div
            className="w-full max-w-md bg-neutral-900 border-t border-neutral-700/80 rounded-t-3xl p-5 pb-8 shadow-2xl space-y-3 animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top pill handle */}
            <div className="w-12 h-1 bg-neutral-700 rounded-full mx-auto mb-3" />

            {/* Header: Calendar + Date | Time | Lab/Lecture Badge */}
            <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 flex-wrap">
              <svg className="w-4 h-4 text-neutral-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="font-mono text-neutral-300">{selectedModal.dateFormatted}</span>
              <span className="text-neutral-600">|</span>
              <span>{selectedModal.timeSlot}</span>
              {selectedModal.slotType !== "None" && (
                <>
                  <span className="text-neutral-600">|</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      selectedModal.slotType === "Lab"
                        ? "bg-teal-950/60 text-teal-300 border border-teal-800/50"
                        : selectedModal.slotType === "Lecture"
                        ? "bg-blue-950/60 text-blue-300 border border-blue-800/50"
                        : "bg-amber-950/60 text-amber-300 border border-amber-800/50"
                    }`}
                  >
                    {selectedModal.slotType}
                  </span>
                </>
              )}
            </div>

            {/* Subject Name with Code */}
            <h3 className="text-lg font-extrabold text-white tracking-tight leading-snug pt-1">
              {selectedModal.subjectName}
            </h3>

            {/* Faculty Name */}
            <p className="text-sm font-medium text-neutral-400">
              {selectedModal.facultyName}
            </p>

            {/* Status & Close Row */}
            <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between">
              {selectedModal.status === "CANCELLED" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 border border-purple-500/30 text-purple-400 font-bold text-xs">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  🚫 Lecture Cancelled
                </span>
              ) : selectedModal.status === "P" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                  </svg>
                  ✓ Present
                </span>
              ) : selectedModal.status === "A" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 border border-red-500/30 text-red-500 font-bold text-xs">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  ✗ Absent
                </span>
              ) : selectedModal.status === "PN" ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 border border-amber-500/30 text-amber-400 font-bold text-xs">
                  ⏳ Attendance Pending
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-400 font-semibold text-xs">
                  - No Lecture / Lab
                </span>
              )}

              <button
                onClick={() => setSelectedModal(null)}
                className="text-xs font-bold text-neutral-300 hover:text-white px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Faculty Wise Modal / Bottom Sheet */}
      {selectedSubject && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center animate-in fade-in duration-150 p-0 sm:p-4"
          onClick={() => setSelectedSubject(null)}
        >
          <div
            className="w-full max-w-md bg-neutral-900 border-t sm:border border-neutral-700/80 rounded-t-3xl sm:rounded-3xl p-5 pb-8 sm:pb-6 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top pill handle */}
            <div className="w-12 h-1 bg-neutral-700 rounded-full mx-auto mb-2 sm:hidden" />

            {/* Header with Subject Details */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-teal-950/70 border border-teal-800/50 text-[11px] font-bold text-teal-300 uppercase tracking-wider mb-1">
                  {selectedSubject.id}
                </div>
                <h3 className="text-lg font-black text-white tracking-tight leading-snug">
                  {selectedSubject.name}
                </h3>
                <p className="text-xs text-neutral-400 font-medium">
                  Faculty-wise Attendance Breakdown
                </p>
              </div>
              <button
                onClick={() => setSelectedSubject(null)}
                className="p-1.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
                title="Close"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Overall Subject Stats Card */}
            <div className="grid grid-cols-3 gap-2 bg-neutral-950/80 border border-neutral-800 rounded-xl p-3">
              <div className="text-center">
                <span className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Total</span>
                <span className="text-base font-black text-white">{selectedSubject.total}</span>
              </div>
              <div className="text-center border-x border-neutral-800">
                <span className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Present</span>
                <span className="text-base font-black text-emerald-400">{selectedSubject.present}</span>
              </div>
              <div className="text-center">
                <span className="block text-[10px] text-neutral-500 font-bold uppercase tracking-wider">Overall</span>
                <span
                  className={`text-base font-black ${
                    selectedSubject.total > 0 &&
                    (selectedSubject.present / selectedSubject.total) * 100 < 75
                      ? "text-red-400"
                      : "text-emerald-400"
                  }`}
                >
                  {selectedSubject.total === 0
                    ? "0.0%"
                    : `${((selectedSubject.present / selectedSubject.total) * 100).toFixed(1)}%`}
                </span>
              </div>
            </div>

            {/* Faculty Distribution List with Slanted Bargraph */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-300">
                <span>Faculty Distribution</span>
                <span className="text-neutral-500 font-normal text-[11px]">Slanted Ratio Graph</span>
              </div>

              {facultyBreakdown.length === 0 ? (
                <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-center text-xs text-neutral-500">
                  No faculty assigned or recorded yet.
                </div>
              ) : (
                facultyBreakdown.map((fac) => {
                  const isGood = fac.percentage >= 75;
                  const hasClasses = fac.total > 0;

                  return (
                    <div
                      key={fac.key}
                      className="bg-neutral-950/60 border border-neutral-800/80 rounded-2xl p-3.5 space-y-2.5 transition-all hover:border-neutral-700"
                    >
                      {/* Faculty Info Header */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-teal-500/20 to-neutral-800 border border-teal-500/30 flex items-center justify-center font-black text-xs text-teal-300 shrink-0">
                            {fac.key.slice(0, 3)}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white leading-tight">
                              {fac.name}
                            </h4>
                            <span className="text-[10px] text-neutral-400 font-medium">
                              {fac.present} of {fac.total} classes attended
                            </span>
                          </div>
                        </div>

                        {/* Percentage Chip */}
                        <div className="text-right shrink-0">
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-xs font-black ${
                              hasClasses
                                ? isGood
                                  ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/50"
                                  : "bg-red-950/80 text-red-300 border border-red-800/50"
                                : "bg-neutral-800 text-neutral-400 border border-neutral-700"
                            }`}
                          >
                            {hasClasses ? `${fac.percentage.toFixed(1)}%` : "0.0%"}
                          </span>
                        </div>
                      </div>

                      {/* Slanted Bargraph container */}
                      <div className="space-y-1">
                        <div className="relative h-4 w-full bg-neutral-900 border border-neutral-700/60 rounded overflow-hidden transform -skew-x-12 px-0.5 py-0.5">
                          {/* 75% Guideline */}
                          <div className="absolute top-0 bottom-0 left-[75%] w-[1.5px] bg-neutral-500/40 z-10 pointer-events-none" />

                          {/* Filled Progress Bar */}
                          <div
                            className={`h-full rounded-sm transition-all duration-700 ${
                              !hasClasses
                                ? "bg-neutral-800"
                                : isGood
                                ? "bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-300 shadow-[0_0_10px_rgba(45,212,191,0.5)]"
                                : "bg-gradient-to-r from-amber-500 via-rose-500 to-red-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, fac.percentage))}%` }}
                          />
                        </div>

                        {/* Bargraph scale labels */}
                        <div className="flex justify-between text-[10px] text-neutral-500 font-semibold px-1">
                          <span>0%</span>
                          <span className="text-neutral-400">75% Target</span>
                          <span>100%</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Close Action */}
            <button
              onClick={() => setSelectedSubject(null)}
              className="w-full mt-2 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white font-bold text-xs rounded-xl transition-colors border border-neutral-700"
            >
              Close Breakdown
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
