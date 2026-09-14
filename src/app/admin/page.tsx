"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  getAllStudents, 
  addStudent, 
  saveAttendance, 
  getAttendance, 
  setLectureCancellation, 
  getClassAttendanceStats, 
  removeStudent, 
  updateStudent, 
  Student, 
  Assignment, 
  addAssignment, 
  getAssignments, 
  deleteAssignment,
  CustomSlot,
  addCustomSlot,
  getCustomSlots,
  deleteCustomSlot
} from "@/services/db";

import { HOLIDAYS_2026 } from "@/lib/constants";

import AdminHeader, { AdminView } from "@/components/admin/AdminHeader";
import RollCallModule from "@/components/admin/RollCallModule";
import ReportsModule from "@/components/admin/ReportsModule";
import AssignmentsModule from "@/components/admin/AssignmentsModule";
import StudentsModule from "@/components/admin/StudentsModule";
import TimetableModule from "@/components/admin/TimetableModule";
import MaterialsModule from "@/components/admin/MaterialsModule";

const DAY_TIMETABLE: Record<number, string[]> = {
  1: ["10:30 - Practical Lab", "12:30 - Computer Fundamental (AAP)", "2:30 - Python (PPP)", "3:30 - Operating System (LSL)", "4:30 - Computer Network (TMS)"],
  2: ["10:30 - Practical Lab", "12:30 - Computer Fundamental (AAP)", "2:30 - Python (PPP)", "3:30 - Operating System (LSL)", "4:30 - Computer Network (AAP)"],
  3: ["10:30 - Practical Lab", "12:30 - Operating System (VLD)", "2:30 - DBMS (JVS)", "3:30 - Python (PPP)", "4:30 - Computer Network (AAP)"],
  4: ["10:30 - Practical Lab", "12:30 - Operating System (VLD)", "2:30 - DBMS (JVS)", "3:30 - Python (PPP)"],
  5: ["10:30 - Practical Lab", "12:30 - Computer Network (TMS)", "2:30 - DBMS (PPP)", "3:30 - Computer Fundamental (AAP)"],
  6: ["10:30 - Practical Lab", "12:30 - Computer Fundamental (AAP)", "2:30 - DBMS (PPP)"],
  0: [] // Sunday
};

const DAY_NAMES: CustomSlot["day"][] = [
  "Sunday" as any,
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function AdminDashboard() {
  const router = useRouter();
  
  const [currentView, setCurrentView] = useState<AdminView>("rollcall");
  
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [newStudent, setNewStudent] = useState({ pid: "", name: "", password: "" });
  const [isLoading, setIsLoading] = useState(true);
  
  // Class Report State
  const [classStats, setClassStats] = useState<Record<string, { present: number, total: number }>>({});
  const [isStatsLoading, setIsStatsLoading] = useState(false);

  // Assignment Management State
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [isAssignmentsLoading, setIsAssignmentsLoading] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    faculty: "",
    subject: "",
    dueDate: "",
    driveUrl: ""
  });
  const [isSubmittingAssignment, setIsSubmittingAssignment] = useState(false);

  // Timetable Custom Slots State
  const [customSlots, setCustomSlots] = useState<CustomSlot[]>([]);
  const [isSlotsLoading, setIsSlotsLoading] = useState(false);
  const [isSubmittingSlot, setIsSubmittingSlot] = useState(false);
  const [newSlot, setNewSlot] = useState<{
    day: CustomSlot["day"];
    date: string;
    time: string;
    timeStart: string;
    subject: string;
    code: string;
    faculty: string;
    type: "Lecture" | "Lab";
  }>({
    day: "Monday",
    date: "",
    time: "5:30 PM - 6:30 PM",
    timeStart: "5:30",
    subject: "Operating System",
    code: "C54",
    faculty: "Prof. VLD",
    type: "Lecture",
  });

  // Date & Calendar Logic - Dynamically initializes to actual system date
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const MIN_DATE = new Date(2026, 7, 3); // Semester Start: Aug 3, 2026

  // Ensure client syncs to exact local system date on mount
  useEffect(() => {
    setCurrentDate(new Date());
  }, []);
  
  // Lecture State
  const [isCancelled, setIsCancelled] = useState(false);
  const [isSavingAttendance, setIsSavingAttendance] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState("");
  
  const currentDayName = DAY_NAMES[currentDate.getDay()];
  const currentDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;
  const baseLectures = DAY_TIMETABLE[currentDate.getDay()] || [];
  const matchingCustom = customSlots.filter(s => {
    if (s.date) return s.date === currentDateStr;
    return s.day === currentDayName;
  });
  const customLectureNames = matchingCustom.map(s => {
    const t = s.timeStart || s.time.split(" ")[0];
    return `${t} - ${s.subject} (${s.faculty})`;
  });
  const availableLectures = Array.from(new Set([...baseLectures, ...customLectureNames]));

  const [selectedLecture, setSelectedLecture] = useState("");

  // Load custom slots on mount
  useEffect(() => {
    async function loadSlots() {
      setIsSlotsLoading(true);
      try {
        const slots = await getCustomSlots();
        setCustomSlots(slots);
      } catch (err) {
        console.error("Error loading custom slots:", err);
      } finally {
        setIsSlotsLoading(false);
      }
    }
    loadSlots();
  }, []);

  // Update selected lecture whenever availableLectures changes
  useEffect(() => {
    if (availableLectures.length > 0) {
      if (!selectedLecture || !availableLectures.includes(selectedLecture)) {
        setSelectedLecture(availableLectures[0]);
      }
    } else {
      setSelectedLecture("");
    }
  }, [availableLectures, selectedLecture]);

  // Fetch students on mount
  useEffect(() => {
    async function fetchStudents() {
      try {
        const data = await getAllStudents();
        setStudents(data.map(s => ({ ...s, status: undefined })));
      } catch (e) {
        console.error("Failed to load students", e);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStudents();
  }, []);

  // Fetch attendance status whenever date or selected lecture changes
  useEffect(() => {
    async function fetchLectureStatus() {
      if (!selectedLecture) {
        setIsCancelled(false);
        return;
      }
      
      const record = await getAttendance(currentDateStr, selectedLecture);
      if (record && record.isCancelled) {
        setIsCancelled(true);
      } else {
        setIsCancelled(false);
      }

      if (record && record.records) {
        setStudents(prev => prev.map(s => ({
          ...s,
          status: record.records[s.pid] || undefined
        })));
      } else {
        setStudents(prev => prev.map(s => ({ ...s, status: undefined })));
      }
      setHasUnsavedChanges(false);
      setSaveSuccessMessage("");
    }
    fetchLectureStatus();
  }, [currentDateStr, selectedLecture]);

  // Fetch Class Report stats when switching to "report" view
  useEffect(() => {
    if (currentView === "report") {
      setIsStatsLoading(true);
      getClassAttendanceStats().then(stats => {
        setClassStats(stats);
        setIsStatsLoading(false);
      }).catch(err => {
        console.error(err);
        setIsStatsLoading(false);
      });
    }
  }, [currentView]);

  // Fetch Assignments when switching to "assignments" view
  useEffect(() => {
    if (currentView === "assignments") {
      setIsAssignmentsLoading(true);
      getAssignments().then(data => {
        setAssignments(data);
        setIsAssignmentsLoading(false);
      }).catch(err => {
        console.error(err);
        setIsAssignmentsLoading(false);
      });
    }
  }, [currentView]);

  const markStudent = (pid: string, status: "PRESENT" | "ABSENT") => {
    if (!selectedLecture) return;
    const currentStudent = students.find(s => s.pid === pid);
    const newStatus = currentStudent?.status === status ? undefined : status;

    setStudents(prev => prev.map(s => 
      s.pid === pid ? { ...s, status: newStatus } : s
    ));
    setHasUnsavedChanges(true);
    setSaveSuccessMessage("");
  };

  const markAll = (status: "PRESENT" | "ABSENT") => {
    if (!selectedLecture) return;
    setStudents(prev => prev.map(s => ({ ...s, status })));
    setHasUnsavedChanges(true);
    setSaveSuccessMessage("");
  };

  const handleSaveAttendance = async () => {
    if (!selectedLecture) return;
    setIsSavingAttendance(true);
    setSaveSuccessMessage("");
    try {
      const records: Record<string, "PRESENT" | "ABSENT" | undefined> = {};
      students.forEach(s => {
        records[s.pid] = s.status === "PRESENT" || s.status === "ABSENT" ? s.status : undefined;
      });

      await saveAttendance(currentDateStr, selectedLecture, records, isCancelled);
      setHasUnsavedChanges(false);
      setSaveSuccessMessage(`Attendance for ${selectedLecture} updated to database!`);
      setTimeout(() => {
        setSaveSuccessMessage("");
      }, 5000);
    } catch (err) {
      console.error("Error saving attendance to database:", err);
      alert("Failed to update attendance to database. Please check your network and try again.");
    } finally {
      setIsSavingAttendance(false);
    }
  };

  const handleCancelLecture = async () => {
    if (!selectedLecture) return;
    const nextCancelled = !isCancelled;
    setIsCancelled(nextCancelled);
    await setLectureCancellation(currentDateStr, selectedLecture, nextCancelled);
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.pid || !newStudent.name) return;
    await addStudent(newStudent.pid, newStudent.name, newStudent.password || "password");
    setNewStudent({ pid: "", name: "", password: "" });
    const data = await getAllStudents();
    setStudents(data);
    alert("Student added successfully to database!");
  };

  const handleRemoveStudent = async (pid: string) => {
    if (window.confirm(`Are you sure you want to permanently delete student ${pid}?`)) {
      try {
        await removeStudent(pid);
        setStudents(prev => prev.filter(s => s.pid !== pid));
        const updatedStats = { ...classStats };
        delete updatedStats[pid.toUpperCase()];
        setClassStats(updatedStats);
        alert(`Student ${pid} removed.`);
      } catch (err) {
        console.error("Error removing student:", err);
        alert("Failed to remove student.");
      }
    }
  };

  const handleEditStudent = async (pid: string, currentName: string) => {
    const newName = window.prompt("Enter new full name for student:", currentName);
    if (newName && newName.trim() && newName.trim() !== currentName) {
      try {
        await updateStudent(pid, { name: newName.trim() });
        setStudents(prev => prev.map(s => s.pid === pid ? { ...s, name: newName.trim() } : s));
        alert("Student name updated successfully.");
      } catch (err) {
        console.error("Error updating student:", err);
        alert("Failed to update student name.");
      }
    }
  };

  const handleAddAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignment.title.trim() || !newAssignment.subject.trim() || !newAssignment.dueDate.trim()) {
      alert("Please fill in Title, Subject, and Due Date.");
      return;
    }

    setIsSubmittingAssignment(true);
    try {
      const facultyFormatted = newAssignment.faculty.trim().startsWith("Prof.") 
        ? newAssignment.faculty.trim() 
        : `Prof. ${newAssignment.faculty.trim()}`;

      await addAssignment({
        title: newAssignment.title.trim(),
        faculty: facultyFormatted,
        subject: newAssignment.subject.trim(),
        dueDate: newAssignment.dueDate.trim(),
        driveUrl: newAssignment.driveUrl.trim()
      });
      const updated = await getAssignments();
      setAssignments(updated);
      setNewAssignment({ title: "", faculty: "", subject: "", dueDate: "", driveUrl: "" });
      alert("Assignment added successfully to database!");
    } catch (err) {
      console.error("Error adding assignment:", err);
      alert("Failed to add assignment.");
    } finally {
      setIsSubmittingAssignment(false);
    }
  };

  const handleDeleteAssignment = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete assignment "${title}"?`)) {
      try {
        await deleteAssignment(id);
        setAssignments(prev => prev.filter(a => a.id !== id));
        alert("Assignment deleted successfully.");
      } catch (err) {
        console.error("Error deleting assignment:", err);
        alert("Failed to delete assignment.");
      }
    }
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlot.subject.trim() || !newSlot.faculty.trim() || !newSlot.time.trim()) {
      alert("Please fill in Subject, Faculty Name, and Time.");
      return;
    }

    setIsSubmittingSlot(true);
    try {
      let theme: CustomSlot["theme"] = "blue";
      const codeUpper = newSlot.code.toUpperCase();
      if (codeUpper === "LAB") theme = "cyan";
      else if (codeUpper === "C55") theme = "blue";
      else if (codeUpper === "C51") theme = "emerald";
      else if (codeUpper === "C54") theme = "purple";
      else if (codeUpper === "C52") theme = "amber";
      else if (codeUpper === "C53") theme = "rose";

      const timeStart = newSlot.timeStart.trim() || newSlot.time.split(" ")[0] || "12:00";
      const facultyFormatted =
        newSlot.faculty.trim().startsWith("Prof.") || newSlot.faculty.trim() === "Lab Faculty"
          ? newSlot.faculty.trim()
          : `Prof. ${newSlot.faculty.trim()}`;

      await addCustomSlot({
        day: newSlot.day,
        date: newSlot.date.trim() || undefined,
        time: newSlot.time.trim(),
        timeStart,
        subject: newSlot.subject.trim(),
        code: newSlot.code.trim().toUpperCase() || "C50",
        faculty: facultyFormatted,
        type: newSlot.type,
        theme,
      });

      const updated = await getCustomSlots();
      setCustomSlots(updated);
      alert("Class slot added successfully to timetable!");
    } catch (err) {
      console.error("Error adding slot:", err);
      alert("Failed to add class slot.");
    } finally {
      setIsSubmittingSlot(false);
    }
  };

  const handleDeleteSlot = async (id: string, subject: string, time: string) => {
    if (window.confirm(`Are you sure you want to remove the slot for "${subject}" at ${time}?`)) {
      try {
        await deleteCustomSlot(id);
        setCustomSlots(prev => prev.filter(s => s.id !== id));
        alert("Slot removed successfully.");
      } catch (err) {
        console.error("Error deleting slot:", err);
        alert("Failed to delete slot.");
      }
    }
  };

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    const now = new Date();
    // End of current system date (today) in local time - guarantees today's attendance can always be marked at any hour
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const minDateStart = new Date(MIN_DATE.getFullYear(), MIN_DATE.getMonth(), MIN_DATE.getDate(), 0, 0, 0, 0);

    for (let d = 1; d <= daysInMonth; d++) {
      const thisDate = new Date(year, month, d, 0, 0, 0, 0);
      const isSelected = thisDate.toDateString() === currentDate.toDateString();
      const isToday = thisDate.toDateString() === now.toDateString();
      const isSunday = thisDate.getDay() === 0;
      const isPastLimit = thisDate < minDateStart || thisDate > todayDate;
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isHoliday = !!HOLIDAYS_2026[dateStr];

      let btnClass = "text-neutral-300 hover:bg-neutral-800";
      if (isSelected) {
        btnClass = "bg-white text-black font-extrabold shadow-md";
      } else if (isToday) {
        btnClass = "text-amber-400 font-extrabold border border-amber-500/50 bg-amber-950/30";
      } else if (isHoliday) {
        btnClass = "bg-blue-600/30 text-blue-400 font-bold border border-blue-500/30";
      } else if (isSunday) {
        btnClass = "bg-red-500/10 text-red-500 font-semibold border border-red-500/20";
      }

      days.push(
        <button
          key={d}
          disabled={isPastLimit}
          onClick={(e) => {
            e.stopPropagation();
            setCurrentDate(thisDate);
            setIsCalendarOpen(false);
          }}
          className={`p-2 text-xs rounded-lg transition-all flex flex-col items-center justify-center h-8 w-8 mx-auto disabled:opacity-20 disabled:hover:bg-transparent ${btnClass}`}
          title={isToday ? "Today (System Date)" : isHoliday ? `Holiday: ${HOLIDAYS_2026[dateStr]}` : isSunday ? "Sunday" : undefined}
        >
          {d}
        </button>
      );
    }
    return days;
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.pid.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black flex flex-col items-center">
      <div className="w-full max-w-md bg-neutral-950 min-h-screen shadow-2xl flex flex-col relative pb-6">
        
        {/* Modular Admin Top Header */}
        <AdminHeader
          currentView={currentView}
          onSelectView={(v) => setCurrentView(v)}
          onLogout={() => router.push("/")}
        />
        
        {/* Dynamic Modular Content View */}
        <div className="flex-1 overflow-y-auto">
          {currentView === "rollcall" && (
            <RollCallModule
              currentDate={currentDate}
              setCurrentDate={setCurrentDate}
              isCalendarOpen={isCalendarOpen}
              setIsCalendarOpen={setIsCalendarOpen}
              formattedDate={formattedDate}
              renderCalendar={renderCalendar}
              availableLectures={availableLectures}
              selectedLecture={selectedLecture}
              setSelectedLecture={setSelectedLecture}
              isCancelled={isCancelled}
              handleCancelLecture={handleCancelLecture}
              markAll={markAll}
              markStudent={markStudent}
              search={search}
              setSearch={setSearch}
              filteredStudents={filteredStudents}
              allStudents={students}
              handleSaveAttendance={handleSaveAttendance}
              isSavingAttendance={isSavingAttendance}
              hasUnsavedChanges={hasUnsavedChanges}
              saveSuccessMessage={saveSuccessMessage}
            />
          )}

          {currentView === "report" && (
            <ReportsModule
              students={students}
              classStats={classStats}
              isStatsLoading={isStatsLoading}
              onBack={() => setCurrentView("rollcall")}
              onRefresh={async () => {
                const data = await getAllStudents();
                setStudents(data.map(s => ({ ...s, status: undefined })));
                const stats = await getClassAttendanceStats();
                setClassStats(stats);
              }}
            />
          )}

          {currentView === "timetable" && (
            <TimetableModule
              customSlots={customSlots}
              isSlotsLoading={isSlotsLoading}
              newSlot={newSlot}
              setNewSlot={setNewSlot}
              isSubmittingSlot={isSubmittingSlot}
              handleAddSlot={handleAddSlot}
              handleDeleteSlot={handleDeleteSlot}
              onBack={() => setCurrentView("rollcall")}
            />
          )}

          {currentView === "materials" && (
            <MaterialsModule
              onBack={() => setCurrentView("rollcall")}
            />
          )}

          {currentView === "assignments" && (
            <AssignmentsModule
              assignments={assignments}
              isAssignmentsLoading={isAssignmentsLoading}
              newAssignment={newAssignment}
              setNewAssignment={setNewAssignment}
              isSubmittingAssignment={isSubmittingAssignment}
              handleAddAssignment={handleAddAssignment}
              handleDeleteAssignment={handleDeleteAssignment}
              onBack={() => setCurrentView("rollcall")}
            />
          )}

          {currentView === "add_student" && (
            <StudentsModule
              newStudent={newStudent}
              setNewStudent={setNewStudent}
              handleAddStudent={handleAddStudent}
              onBack={() => setCurrentView("rollcall")}
              students={students}
              onRefresh={async () => {
                const data = await getAllStudents();
                setStudents(data.map(s => ({ ...s, status: undefined })));
              }}
            />
          )}
        </div>

      </div>
    </div>
  );
}
