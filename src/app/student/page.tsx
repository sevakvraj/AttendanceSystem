"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getStudentAttendanceStats, updateStudent, getStudentAttendanceHistory } from "@/services/db";
import { HOLIDAYS_2026 } from "@/lib/constants";

// Base Subject Template
const SUBJECT_TEMPLATE = [
  { id: "C51", name: "Python", present: 0, total: 0, faculties: { "PPP": { present: 0, total: 0 } } },
  { id: "C52", name: "Computer Network", present: 0, total: 0, faculties: { "TMS": { present: 0, total: 0 }, "AAP": { present: 0, total: 0 } } },
  { id: "C53", name: "DBMS", present: 0, total: 0, faculties: { "JVS": { present: 0, total: 0 }, "PPP": { present: 0, total: 0 } } },
  { id: "C54", name: "Operating System", present: 0, total: 0, faculties: { "LSL": { present: 0, total: 0 }, "VLD": { present: 0, total: 0 } } },
  { id: "C55", name: "Computer Fundamental", present: 0, total: 0, faculties: { "AAP": { present: 0, total: 0 } } },
  { id: "LAB", name: "Practical Lab", present: 0, total: 0, faculties: {} },
];

// Timetable Data remains static for now
const TIMETABLE = [
  { day: "Monday", classes: [
    { time: "10:30-12:30", sub: "Practical Lab" }, { time: "12:30-1:30", sub: "Computer Fundamental (AAP)" },
    { time: "2:30-3:30", sub: "Python (PPP)" }, { time: "3:30-4:30", sub: "Operating System (LSL)", isCancelled: true }, { time: "4:30-5:30", sub: "Computer Network (TMS)" }
  ]},
  { day: "Tuesday", classes: [
    { time: "10:30-12:30", sub: "Practical Lab" }, { time: "12:30-1:30", sub: "Computer Fundamental (AAP)" },
    { time: "2:30-3:30", sub: "Python (PPP)" }, { time: "3:30-4:30", sub: "Operating System (LSL)" }, { time: "4:30-5:30", sub: "Computer Network (AAP)" }
  ]},
  { day: "Wednesday", classes: [
    { time: "10:30-12:30", sub: "Practical Lab" }, { time: "12:30-1:30", sub: "Operating System (VLD)" },
    { time: "2:30-3:30", sub: "DBMS (JVS)" }, { time: "3:30-4:30", sub: "Python (PPP)" }, { time: "4:30-5:30", sub: "Computer Network (AAP)" }
  ]},
  { day: "Thursday", classes: [
    { time: "10:30-12:30", sub: "Practical Lab" }, { time: "12:30-1:30", sub: "Operating System (VLD)" },
    { time: "2:30-3:30", sub: "DBMS (JVS)" }, { time: "3:30-4:30", sub: "Python (PPP)" }
  ]},
  { day: "Friday", classes: [
    { time: "10:30-12:30", sub: "Practical Lab" }, { time: "12:30-1:30", sub: "Computer Network (TMS)" },
    { time: "2:30-3:30", sub: "DBMS (PPP)" }, { time: "3:30-4:30", sub: "Computer Fundamental (AAP)" }
  ]},
  { day: "Saturday", classes: [
    { time: "10:30-12:30", sub: "Practical Lab" }, { time: "12:30-1:30", sub: "Computer Fundamental (AAP)" },
    { time: "2:30-3:30", sub: "DBMS (PPP)" }
  ]}
];

export default function StudentDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"attendance" | "timetable" | "holidays">("attendance");
  const [attendanceView, setAttendanceView] = useState<"subject" | "day">("subject");
  const [expandedSub, setExpandedSub] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Advanced Timetable State
  const [selectedDay, setSelectedDay] = useState("Monday");
  
  // Dynamic State
  const [studentInfo, setStudentInfo] = useState({ pid: "", name: "" });
  const [subjects, setSubjects] = useState(SUBJECT_TEMPLATE);
  const [attendanceHistory, setAttendanceHistory] = useState<Array<{ date: string, lecture: string, subject: string, faculty: string, status: "PRESENT" | "ABSENT" }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const pid = localStorage.getItem("studentPid") || "MG26001";
    const name = localStorage.getItem("studentName") || "Student";
    setStudentInfo({ pid, name });

    async function fetchData() {
      try {
        const stats = await getStudentAttendanceStats(pid);
        const history = await getStudentAttendanceHistory(pid);
        setAttendanceHistory(history);
        
        // Merge stats into template
        const updatedSubjects = SUBJECT_TEMPLATE.map(sub => {
          const stat = stats[sub.name] || { present: 0, total: 0, faculties: {} };
          
          // Merge template faculties with actual stats
          const mergedFaculties: any = { ...sub.faculties };
          if (stat.faculties) {
            for (const [fac, data] of Object.entries(stat.faculties)) {
              if (mergedFaculties[fac]) {
                mergedFaculties[fac] = data;
              } else {
                mergedFaculties[fac] = data;
              }
            }
          }
          
          return { ...sub, present: stat.present, total: stat.total, faculties: mergedFaculties };
        });
        
        setSubjects(updatedSubjects as any);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPasswordInput.length >= 6) {
      setIsUpdatingPassword(true);
      try {
        await updateStudent(studentInfo.pid, { password: newPasswordInput });
        alert("Password updated successfully!");
        setShowPasswordModal(false);
        setNewPasswordInput("");
      } catch (err) {
        alert("Failed to update password. Please try again.");
      } finally {
        setIsUpdatingPassword(false);
      }
    } else {
      alert("Password must be at least 6 characters.");
    }
  };

  const totalPresent = subjects.reduce((acc, curr) => acc + curr.present, 0);
  const totalClasses = subjects.reduce((acc, curr) => acc + curr.total, 0);
  const overallPercentage = totalClasses === 0 ? "0.0" : ((totalPresent / totalClasses) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center">
      <div className="w-full max-w-md bg-neutral-950 min-h-screen shadow-2xl flex flex-col relative pb-20">
        
        {/* Header */}
        <div className="bg-neutral-900 p-6 pt-10 text-white rounded-b-[2rem] border-b border-neutral-800 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-xl font-extrabold tracking-tight">Student Portal</h1>
              <p className="text-neutral-400 font-medium text-xs mt-1">{studentInfo.pid} • {studentInfo.name}</p>
            </div>
            <div className="relative z-50">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="bg-neutral-800 hover:bg-neutral-700 p-2.5 rounded-xl transition-all shadow-sm border border-neutral-700">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-neutral-900/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] py-2 text-white border border-neutral-700/50 z-50 overflow-hidden transform origin-top-right transition-all">
                  <button onClick={() => { setActiveTab("attendance"); setIsMenuOpen(false); }} className="w-full flex items-center space-x-3 px-5 py-3.5 hover:bg-gradient-to-r hover:from-teal-600/20 hover:to-transparent font-bold text-sm transition-all border-b border-neutral-800/50 group">
                    <svg className="w-5 h-5 text-teal-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    <span>Attendance Details</span>
                  </button>
                  <button onClick={() => { setActiveTab("timetable"); setIsMenuOpen(false); }} className="w-full flex items-center space-x-3 px-5 py-3.5 hover:bg-gradient-to-r hover:from-amber-600/20 hover:to-transparent font-bold text-sm transition-all border-b border-neutral-800/50 group">
                    <svg className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span>View Timetable</span>
                  </button>
                  <button onClick={() => { setActiveTab("holidays"); setIsMenuOpen(false); }} className="w-full flex items-center space-x-3 px-5 py-3.5 hover:bg-gradient-to-r hover:from-emerald-600/20 hover:to-transparent font-bold text-sm transition-all border-b border-neutral-800/50 group">
                    <svg className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span>Holiday Calendar</span>
                  </button>
                  <button onClick={() => { setShowPasswordModal(true); setIsMenuOpen(false); }} className="w-full flex items-center space-x-3 px-5 py-3.5 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-transparent font-bold text-sm transition-all border-b border-neutral-800/50 group">
                    <svg className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
                    <span>Change Password</span>
                  </button>
                  <button onClick={() => router.push("/")} className="w-full flex items-center space-x-3 px-5 py-3.5 mt-1 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-transparent text-red-500 font-bold text-sm transition-all group">
                    <svg className="w-5 h-5 text-red-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="text-neutral-500 font-bold uppercase tracking-wider text-xs mb-1">Overall</p>
              <h2 className="text-4xl font-black">{overallPercentage}%</h2>
            </div>
            <div className="text-right">
              <p className="text-neutral-500 font-bold uppercase tracking-wider text-xs mb-1">Lectures</p>
              <p className="text-xl font-bold">{totalPresent} <span className="text-neutral-600">/ {totalClasses}</span></p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {activeTab === "attendance" ? (
            <div className="space-y-4">
              
              {/* GNUMS-Style Segmented Tabs (Teal) */}
              <div className="bg-teal-950/40 p-1.5 rounded-2xl border border-teal-800/40 flex gap-2 shadow-inner">
                <button 
                  onClick={() => setAttendanceView("subject")}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                    attendanceView === "subject" 
                      ? "bg-teal-600 text-white shadow-md shadow-teal-950/50" 
                      : "text-teal-400 hover:text-white"
                  }`}
                >
                  Subject Wise
                </button>
                <button 
                  onClick={() => setAttendanceView("day")}
                  className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                    attendanceView === "day" 
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
              ) : attendanceView === "subject" ? (
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
                            <tr key={sub.id} className="hover:bg-neutral-800/30 transition-colors">
                              <td className="p-3 border-r border-neutral-800/60">
                                <span className="text-xs font-bold text-white block leading-snug">{sub.id} - {sub.name}</span>
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
                  {/* Legend matching GNUMS */}
                  <div className="text-[10px] font-semibold text-neutral-400 px-1 mb-2 leading-relaxed">
                    <span className="text-emerald-400 font-bold">P</span> = Present, <span className="text-red-400 font-bold">A</span> = Absent, <span className="text-amber-400 font-bold">PN</span> = Pending, <span className="text-neutral-500 font-bold">-</span> = No Lecture/Lab
                  </div>

                  {attendanceHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-10 bg-neutral-900 rounded-3xl border border-neutral-800 text-center">
                      <p className="text-neutral-400 font-bold text-xs">No attendance records found yet.</p>
                    </div>
                  ) : (
                    <div className="bg-neutral-900 rounded-2xl border border-neutral-800 overflow-x-auto shadow-sm">
                      <table className="w-full text-left min-w-[420px] border-collapse">
                        <thead className="bg-neutral-800/80 border-b border-neutral-800">
                          <tr>
                            <th className="p-2.5 text-[11px] font-bold text-neutral-300 border-r border-neutral-800">Date</th>
                            <th className="p-2 text-center text-[10px] font-bold text-neutral-400 border-r border-neutral-800">Slot<br/>1</th>
                            <th className="p-2 text-center text-[10px] font-bold text-neutral-400 border-r border-neutral-800">Slot<br/>2</th>
                            <th className="p-2 text-center text-[10px] font-bold text-neutral-400 border-r border-neutral-800">Slot<br/>3</th>
                            <th className="p-2 text-center text-[10px] font-bold text-neutral-400 border-r border-neutral-800">Slot<br/>4</th>
                            <th className="p-2 text-center text-[10px] font-bold text-neutral-400">Slot<br/>5</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/50">
                          {Object.entries(
                            attendanceHistory.reduce((acc, curr) => {
                              if (!acc[curr.date]) acc[curr.date] = [];
                              acc[curr.date].push(curr);
                              return acc;
                            }, {} as Record<string, typeof attendanceHistory>)
                          ).sort(([dateA], [dateB]) => dateB.localeCompare(dateA)).map(([date, records]) => {
                            const dateObj = new Date(date);
                            
                            // Map lecture times to Slot 1 - 5
                            const slots = ["-", "-", "-", "-", "-"];
                            records.forEach(rec => {
                              if (rec.lecture.includes("10:30")) slots[0] = rec.status === "PRESENT" ? "P" : "A";
                              else if (rec.lecture.includes("12:30")) slots[1] = rec.status === "PRESENT" ? "P" : "A";
                              else if (rec.lecture.includes("2:30")) slots[2] = rec.status === "PRESENT" ? "P" : "A";
                              else if (rec.lecture.includes("3:30")) slots[3] = rec.status === "PRESENT" ? "P" : "A";
                              else if (rec.lecture.includes("4:30")) slots[4] = rec.status === "PRESENT" ? "P" : "A";
                            });

                            return (
                              <tr key={date} className="hover:bg-neutral-800/30 transition-colors">
                                <td className="p-2.5 border-r border-neutral-800 whitespace-nowrap">
                                  <span className="block text-xs font-bold text-white">
                                    {dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                                  </span>
                                  <span className="block text-[10px] text-neutral-500 font-semibold">
                                    {dateObj.toLocaleString('en-GB', { weekday: 'short' })}
                                  </span>
                                </td>
                                {slots.map((slot, idx) => (
                                  <td 
                                    key={idx} 
                                    className={`p-2 text-center border-r border-neutral-800 last:border-0 ${
                                      slot === 'P' ? 'bg-emerald-950/20' : 
                                      slot === 'A' ? 'bg-red-950/20' : 
                                      slot === 'PN' ? 'bg-amber-950/20' : ''
                                    }`}
                                  >
                                    <span className={`text-xs font-black ${
                                      slot === 'P' ? 'text-emerald-400' : 
                                      slot === 'A' ? 'text-red-400' : 
                                      slot === 'PN' ? 'text-amber-400' : 'text-neutral-600'
                                    }`}>
                                      {slot}
                                    </span>
                                  </td>
                                ))}
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : activeTab === "timetable" ? (
            <div className="space-y-6 pb-6">
              
              <div className="flex justify-between items-center px-1">
                <div>
                  <h2 className="text-white font-extrabold text-xl tracking-tight">MCA-I Timetable</h2>
                  <p className="text-neutral-500 text-xs font-bold mt-1">Batch 1 • Room 104</p>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-lg text-xs font-bold text-neutral-300">
                  Sem 1
                </div>
              </div>

              {/* Advanced Horizontal Day Selector */}
              <div className="flex space-x-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {TIMETABLE.map((dayData) => (
                  <button
                    key={dayData.day}
                    onClick={() => setSelectedDay(dayData.day)}
                    className={`flex-shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-sm ${
                      selectedDay === dayData.day 
                        ? 'bg-white text-black' 
                        : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                    }`}
                  >
                    {dayData.day.slice(0, 3)}
                  </button>
                ))}
              </div>

              {/* Clean List UI */}
              <div className="bg-neutral-900 rounded-3xl border border-neutral-800 p-4 shadow-inner space-y-4">
                {TIMETABLE.find(d => d.day === selectedDay)?.classes.map((cls, cIdx) => (
                  <div key={cIdx} className={`rounded-2xl p-5 transition-all shadow-sm ${
                    cls.isCancelled ? 'bg-red-950/20 border border-red-900/30' : 'bg-neutral-950 border border-neutral-800'
                  }`}>
                    <div className="flex justify-between items-center">
                      <div className="flex-1 pr-2">
                        <span className={`text-base font-black tracking-tight ${cls.isCancelled ? 'text-neutral-500 line-through' : 'text-white'}`}>{cls.sub}</span>
                        {cls.isCancelled && <div className="mt-1.5 inline-block"><span className="text-[10px] font-bold text-red-500 bg-red-500/10 px-2.5 py-1 rounded-md uppercase tracking-widest border border-red-500/20">Cancelled</span></div>}
                      </div>
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-xl tracking-wider ${
                        cls.isCancelled ? 'text-neutral-600 bg-neutral-900/50' : 'text-neutral-300 bg-neutral-800 border border-neutral-700'
                      }`}>{cls.time}</span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ) : (
            <div className="space-y-6 pb-6">
              <div className="flex justify-between items-center px-1">
                <div>
                  <h2 className="text-white font-extrabold text-xl tracking-tight">Holiday Calendar</h2>
                  <p className="text-neutral-500 text-xs font-bold mt-1">Academic Year 2026</p>
                </div>
                <div className="bg-blue-900/20 border border-blue-900/50 px-3 py-1.5 rounded-lg text-xs font-bold text-blue-400">
                  {Object.keys(HOLIDAYS_2026).length} Holidays
                </div>
              </div>

              <div className="space-y-3">
                {Object.entries(HOLIDAYS_2026).sort(([dateA], [dateB]) => dateA.localeCompare(dateB)).map(([date, name]) => {
                  const dateObj = new Date(date);
                  const isPast = dateObj < new Date();
                  const monthName = dateObj.toLocaleString('default', { month: 'short' });
                  const dayNum = dateObj.getDate();
                  const dayName = dateObj.toLocaleString('default', { weekday: 'short' });

                  return (
                    <div key={date} className={`flex items-center p-4 rounded-2xl border transition-all ${isPast ? 'bg-neutral-900/50 border-neutral-800/50 opacity-60' : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'}`}>
                      <div className={`flex flex-col items-center justify-center w-14 h-14 rounded-xl mr-4 ${isPast ? 'bg-neutral-950 text-neutral-500' : 'bg-blue-950 text-blue-400 border border-blue-900/50'}`}>
                        <span className="text-[10px] uppercase font-bold tracking-widest">{monthName}</span>
                        <span className="text-xl font-black leading-none mt-0.5">{dayNum}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold text-base ${isPast ? 'text-neutral-400' : 'text-white'}`}>{name}</h3>
                        <p className="text-xs font-medium text-neutral-500 mt-1">{dayName}</p>
                      </div>
                      {!isPast && (
                        <div className="px-3 py-1 bg-neutral-950 rounded-lg border border-neutral-800">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Upcoming</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 w-full bg-neutral-900 border-t border-neutral-800 p-4 flex justify-around items-center rounded-b-3xl z-20">
          <div className={`flex flex-col items-center cursor-pointer transition-colors ${activeTab === 'attendance' ? 'text-white' : 'text-neutral-600'}`} onClick={() => setActiveTab('attendance')}>
            <div className={`w-12 h-8 rounded-full flex items-center justify-center mb-1 ${activeTab === 'attendance' ? 'bg-neutral-800' : ''}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            </div>
            <span className="text-[10px] font-bold">Attendance</span>
          </div>
          
          <div className={`flex flex-col items-center cursor-pointer transition-colors ${activeTab === 'timetable' ? 'text-white' : 'text-neutral-600'}`} onClick={() => setActiveTab('timetable')}>
            <div className={`w-12 h-8 rounded-full flex items-center justify-center mb-1 ${activeTab === 'timetable' ? 'bg-neutral-800' : ''}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            </div>
            <span className="text-[10px] font-bold">Timetable</span>
          </div>
        </div>

      </div>
      
      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl relative overflow-hidden">
            
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-white tracking-tight flex items-center">
                <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Update Password
              </h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-neutral-500 hover:text-white bg-neutral-950 p-2 rounded-full transition-colors border border-neutral-800 hover:border-neutral-700">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <p className="text-neutral-400 text-sm mb-6 font-medium">Please enter a secure password with at least 6 characters.</p>
            
            <form onSubmit={handleSubmitPassword}>
              <div className="mb-6">
                <input 
                  type="text" 
                  autoFocus
                  placeholder="New password..." 
                  value={newPasswordInput} 
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white p-4 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all font-medium placeholder-neutral-700"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={isUpdatingPassword || newPasswordInput.length < 6}
                className="w-full bg-white text-black font-bold py-4 rounded-xl hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)] flex justify-center items-center"
              >
                {isUpdatingPassword ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                ) : (
                  "Confirm Change"
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
