"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAllStudents, addStudent, saveAttendance, getAttendance, getClassAttendanceStats, removeStudent, updateStudent, Student } from "@/services/db";

import { HOLIDAYS_2026 } from "@/lib/constants";

const DAY_TIMETABLE: Record<number, string[]> = {
  1: ["10:30 - Practical Lab", "12:30 - Computer Fundamental (AAP)", "2:30 - Python (PPP)", "3:30 - Operating System (LSL)", "4:30 - Computer Network (TMS)"],
  2: ["10:30 - Practical Lab", "12:30 - Computer Fundamental (AAP)", "2:30 - Python (PPP)", "3:30 - Operating System (LSL)", "4:30 - Computer Network (AAP)"],
  3: ["10:30 - Practical Lab", "12:30 - Operating System (VLD)", "2:30 - DBMS (JVS)", "3:30 - Python (PPP)", "4:30 - Computer Network (AAP)"],
  4: ["10:30 - Practical Lab", "12:30 - Operating System (VLD)", "2:30 - DBMS (JVS)", "3:30 - Python (PPP)"],
  5: ["10:30 - Practical Lab", "12:30 - Computer Network (TMS)", "2:30 - DBMS (PPP)", "3:30 - Computer Fundamental (AAP)"],
  6: ["10:30 - Practical Lab", "12:30 - Computer Fundamental (AAP)", "2:30 - DBMS (PPP)"],
  0: [] // Sunday
};

export default function AdminDashboard() {
  const router = useRouter();
  
  const [currentView, setCurrentView] = useState("rollcall");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [newStudent, setNewStudent] = useState({ pid: "", name: "", password: "" });
  const [isLoading, setIsLoading] = useState(true);
  
  // Class Report State
  const [classStats, setClassStats] = useState<Record<string, { present: number, total: number }>>({});
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  // Date & Calendar Logic
  const [currentDate, setCurrentDate] = useState(new Date(2026, 8, 7)); // Default Sept 7, 2026
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const MIN_DATE = new Date(2026, 7, 3); // Aug 3, 2026
  
  // Lecture State
  const [isCancelled, setIsCancelled] = useState(false);
  const availableLectures = DAY_TIMETABLE[currentDate.getDay()] || [];
  const [selectedLecture, setSelectedLecture] = useState("");

  const formattedDate = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).format(currentDate);

  // Update selected lecture when date changes
  useEffect(() => {
    const lecturesForDay = DAY_TIMETABLE[currentDate.getDay()] || [];
    if (lecturesForDay.length > 0) {
      if (!lecturesForDay.includes(selectedLecture)) {
        setSelectedLecture(lecturesForDay[0]);
      }
    } else {
      setSelectedLecture("");
    }
  }, [currentDate]);

  // Load students and specific attendance record
  useEffect(() => {
    async function loadData() {
      if (!selectedLecture) {
        setStudents([]);
        return;
      }
      setIsLoading(true);
      try {
        const allStudents = await getAllStudents();
        const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
        const record = await getAttendance(dateStr, selectedLecture);
        
        if (record) {
          setStudents(allStudents.map(s => ({
            ...s,
            status: record[s.pid] || "UNMARKED"
          })));
        } else {
          setStudents(allStudents);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [currentDate, selectedLecture]);

  // Load class report data
  useEffect(() => {
    if (currentView === "report") {
      setIsStatsLoading(true);
      getClassAttendanceStats().then(stats => {
        setClassStats(stats);
      }).catch(err => console.error(err))
        .finally(() => setIsStatsLoading(false));
    }
  }, [currentView]);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const dateObj = new Date(year, month, day);
      const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const isHoliday = HOLIDAYS_2026[dateString];
      const isSunday = dateObj.getDay() === 0;
      const isBeforeMin = dateObj < MIN_DATE;
      const isSelected = dateObj.getDate() === currentDate.getDate() && dateObj.getMonth() === currentDate.getMonth();

      let bgClass = "bg-neutral-900 hover:bg-neutral-800";
      let textClass = "text-neutral-300";
      
      if (isBeforeMin) {
        bgClass = "bg-neutral-900 opacity-20 cursor-not-allowed";
      } else if (isSelected) {
        bgClass = "bg-white text-black shadow-md";
        textClass = "text-black font-bold";
      } else if (isHoliday) {
        bgClass = "bg-blue-900/30 border border-blue-900/50";
        textClass = "text-blue-400 font-bold";
      } else if (isSunday) {
        bgClass = "bg-red-900/30 border border-red-900/50";
        textClass = "text-red-400 font-bold";
      }

      days.push(
        <button
          key={day}
          disabled={isBeforeMin}
          onClick={() => {
            setCurrentDate(dateObj);
            setIsCalendarOpen(false);
            setIsCancelled(false); // reset cancelled state for new day
          }}
          className={`h-10 w-full rounded-xl flex flex-col items-center justify-center transition-all relative ${bgClass}`}
        >
          <span className={`text-sm ${textClass}`}>{day}</span>
          {isHoliday && <span className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-500"></span>}
        </button>
      );
    }
    return days;
  };

  const markStudent = async (pid: string, status: "PRESENT" | "ABSENT") => {
    if (isCancelled) return;
    
    // Optimistic UI update
    const updatedStudents = students.map(s => s.pid === pid ? { ...s, status } : s);
    setStudents(updatedStudents);
    
    // Save to DB
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    const records: Record<string, "PRESENT" | "ABSENT"> = {};
    updatedStudents.forEach(s => {
      if (s.status !== "UNMARKED") records[s.pid] = s.status as "PRESENT" | "ABSENT";
    });
    
    await saveAttendance(dateStr, selectedLecture, records);
  };

  const markAll = async (status: "PRESENT" | "ABSENT") => {
    if (isCancelled) return;
    
    const updatedStudents = students.map(s => ({ ...s, status }));
    setStudents(updatedStudents);
    
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
    const records: Record<string, "PRESENT" | "ABSENT"> = {};
    updatedStudents.forEach(s => {
      records[s.pid] = status;
    });
    
    await saveAttendance(dateStr, selectedLecture, records);
  };

  const handleCancelLecture = () => {
    setIsCancelled(!isCancelled);
  };

  const handleEditStudent = async (pid: string, currentName: string) => {
    const action = window.prompt(`Edit Student: ${currentName} (${pid})\nType '1' to change name\nType '2' to reset password`);
    if (action === "1") {
      const newName = window.prompt("Enter new name:", currentName);
      if (newName && newName !== currentName) {
        try {
          await updateStudent(pid, { name: newName });
          setStudents(students.map(s => s.pid === pid ? { ...s, name: newName } : s));
          alert("Name updated successfully!");
        } catch (e) {
          alert("Failed to update name");
        }
      }
    } else if (action === "2") {
      const newPassword = window.prompt("Enter new password:");
      if (newPassword) {
        try {
          await updateStudent(pid, { password: newPassword });
          alert("Password updated successfully!");
        } catch (e) {
          alert("Failed to update password");
        }
      }
    }
  };

  const handleRemoveStudent = async (pid: string) => {
    if (window.confirm(`Are you sure you want to permanently remove student ${pid}?`)) {
      try {
        await removeStudent(pid);
        setStudents(students.filter(s => s.pid !== pid));
        alert("Student removed from database.");
      } catch (err) {
        console.error(err);
        alert("Failed to remove student.");
      }
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newStudent.pid && newStudent.name) {
      try {
        const pidUpper = newStudent.pid.toUpperCase();
        if (students.some(s => s.pid === pidUpper)) {
          alert("A student with this ID already exists!");
          return;
        }
        await addStudent(pidUpper, newStudent.name, newStudent.password);
        setStudents([...students, { pid: pidUpper, name: newStudent.name, status: "UNMARKED" }]);
        setNewStudent({ pid: "", name: "", password: "" });
        alert("Student added successfully to database!");
        setCurrentView("rollcall");
      } catch (err) {
        console.error(err);
        alert("Error adding student.");
      }
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.pid.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black flex flex-col items-center">
      <div className="w-full max-w-md bg-neutral-950 min-h-screen shadow-2xl flex flex-col relative pb-6">
        
        {/* Admin Header */}
        <div className={`bg-neutral-900 p-6 pt-10 text-white rounded-b-[2rem] border-b border-neutral-800 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative z-20 transition-all duration-500`}>
          <div className="flex justify-between items-center relative z-20 mb-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">Admin Portal</h1>
              <p className={`${isCancelled ? 'text-red-500' : 'text-neutral-400'} font-medium text-sm mt-1`}>
                {isCancelled ? 'Lecture Cancelled' : 'Class Representative Mode'}
              </p>
            </div>
            
            <div className="relative">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="bg-neutral-800 hover:bg-neutral-700 p-2.5 rounded-xl transition-all shadow-sm border border-neutral-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-neutral-900/95 backdrop-blur-xl rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8)] py-2 text-white border border-neutral-700/50 z-50 overflow-hidden transform origin-top-right transition-all">
                  <button onClick={() => { setCurrentView("rollcall"); setIsMenuOpen(false); }} className="w-full flex items-center space-x-3 px-5 py-3.5 hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-transparent font-bold text-sm transition-all border-b border-neutral-800/50 group">
                    <svg className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path></svg>
                    <span>Roll Call Dashboard</span>
                  </button>
                  <button onClick={() => { setCurrentView("report"); setIsMenuOpen(false); }} className="w-full flex items-center space-x-3 px-5 py-3.5 hover:bg-gradient-to-r hover:from-emerald-600/20 hover:to-transparent font-bold text-sm transition-all border-b border-neutral-800/50 group">
                    <svg className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    <span>Class Attendance Report</span>
                  </button>
                  <button onClick={() => { setCurrentView("add_student"); setIsMenuOpen(false); }} className="w-full flex items-center space-x-3 px-5 py-3.5 hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-transparent font-bold text-sm transition-all border-b border-neutral-800/50 group">
                    <svg className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                    <span>Add New Student</span>
                  </button>
                  <button onClick={() => { setCurrentView("timetable"); setIsMenuOpen(false); }} className="w-full flex items-center space-x-3 px-5 py-3.5 hover:bg-gradient-to-r hover:from-amber-600/20 hover:to-transparent font-bold text-sm transition-all border-b border-neutral-800/50 group">
                    <svg className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span>Manage Timetable</span>
                  </button>
                  <button onClick={() => router.push("/")} className="w-full flex items-center space-x-3 px-5 py-3.5 mt-1 hover:bg-gradient-to-r hover:from-red-600/20 hover:to-transparent text-red-500 font-bold text-sm transition-all group">
                    <svg className="w-5 h-5 text-red-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {currentView === "rollcall" && (
            <div className={`bg-neutral-950 border ${isCancelled ? 'border-red-900/50' : 'border-neutral-800'} rounded-2xl p-4 shadow-xl text-white transition-all relative`}>
              <div 
                className="flex justify-between items-center mb-3 pb-3 border-b border-neutral-800 cursor-pointer hover:bg-neutral-900 rounded-lg p-2"
                onClick={() => !isCancelled && setIsCalendarOpen(!isCalendarOpen)}
              >
                <div className="flex items-center space-x-2">
                  <svg className={`w-5 h-5 ${isCancelled ? 'text-red-500' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                  <h2 className={`font-bold ${isCancelled ? 'text-red-500' : 'text-white'}`}>{formattedDate}</h2>
                </div>
                <svg className={`w-4 h-4 text-neutral-500 transition-transform ${isCalendarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>

              {/* Modern Calendar Dropdown */}
              {isCalendarOpen && !isCancelled && (
                <div className="mb-4 bg-neutral-950 border border-neutral-800 rounded-xl p-3 shadow-inner">
                  <div className="flex justify-between items-center mb-2 px-1">
                    <button onClick={(e) => { e.stopPropagation(); setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)); }} className="text-neutral-500 hover:text-white p-1"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg></button>
                    <span className="font-bold text-sm text-white">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</span>
                    <button onClick={(e) => { e.stopPropagation(); setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)); }} className="text-neutral-500 hover:text-white p-1"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg></button>
                  </div>
                  <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-neutral-600 mb-2">
                    <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {renderCalendar()}
                  </div>
                  
                  {/* Legend */}
                  <div className="mt-3 flex space-x-3 text-[10px] font-bold text-neutral-500 justify-center">
                    <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span> Holiday</div>
                    <div className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-500/20 border border-red-500/50 mr-1"></span> Sunday</div>
                  </div>
                </div>
              )}
              
              <div className="relative">
                <select 
                  disabled={isCancelled || availableLectures.length === 0} 
                  value={selectedLecture} 
                  onChange={e => setSelectedLecture(e.target.value)} 
                  className={`w-full bg-neutral-900 border ${availableLectures.length === 0 ? 'border-red-900/50 text-red-500' : 'border-neutral-800 text-white'} rounded-xl px-4 py-3 text-sm font-bold outline-none disabled:opacity-50 appearance-none shadow-inner focus:border-neutral-600 transition-colors`}
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
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Content Body */}
        <div className="flex-1 overflow-y-auto">
          {currentView === "rollcall" ? (
            <div className="p-6">
              {availableLectures.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-blue-950/30 border border-blue-900/50 rounded-full flex items-center justify-center mb-6 text-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Holiday / Weekend</h3>
                  <p className="text-neutral-500 text-sm font-medium max-w-[250px]">Relax and enjoy your day off. No classes are scheduled for today!</p>
                </div>
              ) : (
                <>
                  <div className="flex space-x-3 mb-6">
                    <button disabled={isCancelled} onClick={() => markAll("PRESENT")} className="flex-1 bg-white text-black font-bold py-3 rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] active:scale-95 text-sm disabled:opacity-30 disabled:grayscale">
                      Mark All Present
                    </button>
                    <button onClick={handleCancelLecture} className={`flex-1 font-bold py-3 rounded-xl transition-all active:scale-95 text-sm ${isCancelled ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-neutral-900 border border-neutral-800 text-white hover:bg-neutral-800'}`}>
                      {isCancelled ? 'Undo Cancel' : 'Cancel Lecture'}
                    </button>
                  </div>

                  {isCancelled ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="w-16 h-16 bg-red-950/30 border border-red-900/50 rounded-full flex items-center justify-center mb-4 text-red-500">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">Lecture Cancelled</h3>
                      <p className="text-neutral-500 text-sm font-medium">No attendance will be recorded for this slot.</p>
                    </div>
                  ) : (
                    <>
                      <div className="relative mb-4">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <input 
                          type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                          className="w-full pl-11 pr-4 py-4 rounded-xl border border-neutral-800 focus:border-white focus:ring-1 focus:ring-white outline-none transition-all bg-neutral-900 text-white shadow-sm font-medium placeholder-neutral-600"
                          placeholder="Search student..."
                        />
                      </div>

                      <div className="space-y-3">
                        {filteredStudents.map((student) => (
                          <div key={student.pid} className={`flex justify-between items-center p-4 rounded-2xl border transition-all ${student.status === "PRESENT" ? "border-emerald-500/50 bg-emerald-950/20" : student.status === "ABSENT" ? "border-red-500/50 bg-red-950/20" : "border-neutral-800 bg-neutral-900"}`}>
                            <div>
                              <h3 className={`font-bold ${student.status === "PRESENT" ? "text-emerald-400" : student.status === "ABSENT" ? "text-red-400" : "text-white"}`}>{student.name}</h3>
                              <p className="text-xs text-neutral-500 font-medium">{student.pid}</p>
                            </div>
                            
                            <div className="flex space-x-2">
                              <button onClick={() => markStudent(student.pid, "PRESENT")} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${student.status === "PRESENT" ? "bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-neutral-950 border border-neutral-800 text-neutral-500 hover:bg-emerald-950 hover:text-emerald-500 hover:border-emerald-900"}`}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                              </button>
                              <button onClick={() => markStudent(student.pid, "ABSENT")} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${student.status === "ABSENT" ? "bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.3)]" : "bg-neutral-950 border border-neutral-800 text-neutral-500 hover:bg-red-950 hover:text-red-500 hover:border-red-900"}`}>
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          ) : currentView === "report" ? (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Class Report</h2>
                <button onClick={() => setCurrentView("rollcall")} className="text-sm font-bold text-neutral-400 hover:text-white bg-neutral-900 px-3 py-1 rounded-lg border border-neutral-800">Back</button>
              </div>
              
              {isStatsLoading ? (
                <div className="flex justify-center p-12"><div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div></div>
              ) : (
                <div className="space-y-3">
                  {students.map((student) => {
                    const stats = classStats[student.pid.toUpperCase()];
                    const presentCount = stats?.present || 0;
                    const totalCount = stats?.total || 0;
                    const percentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;
                    
                    // Same gradient logic as student dashboard
                    const isGood = percentage >= 75;
                    const gradientClass = totalCount === 0 ? "from-neutral-800 to-neutral-900 text-neutral-500 border-neutral-800" :
                                          isGood ? "from-emerald-900/40 to-emerald-950/20 text-emerald-400 border-emerald-500/30" : 
                                          "from-red-900/40 to-red-950/20 text-red-400 border-red-500/30";

                    return (
                      <div key={student.pid} className={`flex justify-between items-center p-4 rounded-2xl border bg-gradient-to-r ${gradientClass}`}>
                        <div>
                          <h3 className="font-bold text-white flex items-center gap-2">
                            {student.name}
                            <button onClick={() => handleEditStudent(student.pid, student.name)} className="text-blue-500 hover:text-blue-400 p-1 rounded-full hover:bg-blue-950/50 transition-colors ml-1" title="Edit Student">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                            </button>
                            <button onClick={() => handleRemoveStudent(student.pid)} className="text-red-500 hover:text-red-400 p-1 rounded-full hover:bg-red-950/50 transition-colors" title="Remove Student">
                              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                            </button>
                          </h3>
                          <p className="text-xs text-neutral-400 font-medium">{student.pid}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black">{percentage}%</p>
                          <p className="text-[10px] uppercase font-bold opacity-70 tracking-wider">{presentCount} / {totalCount} Classes</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : currentView === "add_student" ? (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Manage Students</h2>
                <button onClick={() => setCurrentView("rollcall")} className="text-sm font-bold text-neutral-400 hover:text-white bg-neutral-900 px-3 py-1 rounded-lg border border-neutral-800">Back</button>
              </div>
              
              <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 shadow-sm mb-6">
                <h3 className="font-bold text-white mb-4">Add New Student</h3>
                <form onSubmit={handleAddStudent} className="space-y-4">
                  <input type="text" placeholder="PID (e.g. 26MCA1001)" value={newStudent.pid} onChange={e => setNewStudent({...newStudent, pid: e.target.value})} className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 outline-none focus:border-white focus:ring-1 focus:ring-white font-medium text-sm transition-all" required />
                  <input type="text" placeholder="Full Name" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 outline-none focus:border-white focus:ring-1 focus:ring-white font-medium text-sm transition-all" required />
                  <input type="password" placeholder="Default Password" value={newStudent.password} onChange={e => setNewStudent({...newStudent, password: e.target.value})} className="w-full p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 outline-none focus:border-white focus:ring-1 focus:ring-white font-medium text-sm transition-all" required />
                  <button type="submit" className="w-full bg-white text-black font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:scale-[1.02] transition-transform text-sm mt-2">Add to Database</button>
                </form>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Timetable Settings</h2>
                <button onClick={() => setCurrentView("rollcall")} className="text-sm font-bold text-neutral-400 hover:text-white bg-neutral-900 px-3 py-1 rounded-lg border border-neutral-800">Back</button>
              </div>
              <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 text-neutral-400 text-sm font-medium">
                Timetable and Subject management forms will be synced directly to Firebase collections here.
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
