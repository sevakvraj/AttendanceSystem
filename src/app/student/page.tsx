"use client";

import React, { useEffect, useState } from "react";
import { getStudentAttendanceStats, getStudentAttendanceHistory, AttendanceHistoryItem, getStudentByPid } from "@/services/db";
import { fetchCurrentSession, logout } from "@/lib/auth-client";
import StudentHeader from "@/components/student/StudentHeader";
import DashboardGrid, { StudentViewOption } from "@/components/student/DashboardGrid";
import AttendanceView, { SubjectStat } from "@/components/student/AttendanceView";
import TimetableView from "@/components/student/TimetableView";
import HolidayView from "@/components/student/HolidayView";
import AssignmentView from "@/components/student/AssignmentView";
import StudyMaterialView from "@/components/student/StudyMaterialView";
import OldPapersView from "@/components/student/OldPapersView";
import MemoriesView from "@/components/student/MemoriesView";
import CreditsView from "@/components/student/CreditsView";
import PasswordModal from "@/components/student/PasswordModal";

// Base Subject Template
const SUBJECT_TEMPLATE: SubjectStat[] = [
  { id: "C51", name: "Python", present: 0, total: 0, faculties: { PPP: { present: 0, total: 0 } } },
  { id: "C52", name: "Computer Network", present: 0, total: 0, faculties: { TMS: { present: 0, total: 0 }, AAP: { present: 0, total: 0 } } },
  { id: "C53", name: "DBMS", present: 0, total: 0, faculties: { JVS: { present: 0, total: 0 }, PPP: { present: 0, total: 0 } } },
  { id: "C54", name: "Operating System", present: 0, total: 0, faculties: { LSL: { present: 0, total: 0 }, VLD: { present: 0, total: 0 } } },
  { id: "C55", name: "Computer Fundamental", present: 0, total: 0, faculties: { AAP: { present: 0, total: 0 } } },
  { id: "LAB", name: "Practical Lab", present: 0, total: 0, faculties: { LAB: { present: 0, total: 0 } } },
];

export type StudentView = "home" | StudentViewOption;

export default function StudentDashboard() {
  const [currentView, setCurrentView] = useState<StudentView>("home");
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  // Dynamic State
  const [studentInfo, setStudentInfo] = useState({ pid: "", name: "" });
  const [subjects, setSubjects] = useState<SubjectStat[]>(SUBJECT_TEMPLATE);
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBlocked, setIsBlocked] = useState(false);

  useEffect(() => {
    async function initAndFetchData() {
      try {
        // 1. Strictly verify session from server JWT cookie
        const session = await fetchCurrentSession();
        if (!session || !session.pid) {
          logout();
          return;
        }

        const pid = session.pid;
        const name = session.name || "Student";
        setStudentInfo({ pid, name });

        // 2. Fetch up-to-date student profile from Firestore (reflects admin changes)
        const profile = await getStudentByPid(pid);
        if (profile) {
          setStudentInfo({ pid: profile.pid, name: profile.name });
          if (profile.isBlocked) {
            setIsBlocked(true);
            setIsLoading(false);
            return;
          }
        }

        // 3. Fetch attendance aggregated statistics strictly for this student
        const stats = await getStudentAttendanceStats(pid);

        // 4. Fetch detailed lecture history strictly for this student
        const history = await getStudentAttendanceHistory(pid);
        setAttendanceHistory(history);

        // 5. Merge stats into template (flexible name matching e.g. Python / Python Programming)
        const updatedSubjects = SUBJECT_TEMPLATE.map((sub) => {
          const stat =
            stats[sub.name] ||
            stats[sub.name === "Python" ? "Python Programming" : "Python"] ||
            { present: 0, total: 0, faculties: {} };

          const mergedFaculties: Record<string, { present: number; total: number }> = {
            ...(sub.faculties || {}),
          };

          if (stat.faculties) {
            for (const [fac, data] of Object.entries(stat.faculties)) {
              mergedFaculties[fac] = data;
            }
          }
          return { ...sub, present: stat.present, total: stat.total, faculties: mergedFaculties };
        });

        setSubjects(updatedSubjects);
      } catch (e) {
        console.error("Error fetching student stats:", e);
      } finally {
        setIsLoading(false);
      }
    }

    initAndFetchData();
  }, []);

  const totalPresent = subjects.reduce((acc, curr) => acc + curr.present, 0);
  const totalClasses = subjects.reduce((acc, curr) => acc + curr.total, 0);
  const overallPercentage = totalClasses === 0 ? "0.0" : ((totalPresent / totalClasses) * 100).toFixed(1);

  if (isLoading && !studentInfo.pid) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-3 border-teal-500/30 border-t-teal-400 rounded-full animate-spin mb-3"></div>
        <p className="text-xs font-bold text-neutral-400 tracking-wider uppercase">Verifying Session...</p>
      </div>
    );
  }

  if (isBlocked) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-sm bg-neutral-900 border border-red-900/60 rounded-3xl p-8 shadow-2xl space-y-4">
          <div className="w-16 h-16 bg-red-950/50 border border-red-800/80 rounded-full flex items-center justify-center mx-auto text-red-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-black text-white">Access Blocked by Admin</h2>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Your account (<strong className="text-white font-mono">{studentInfo.pid}</strong>) has been suspended from the student portal by the class administrator.
          </p>
          <p className="text-[11px] text-neutral-500">
            Please contact your Class Representative or Department Office to restore your access.
          </p>
          <button
            onClick={() => logout()}
            className="w-full py-3 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            Logout & Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center scrollbar-none">
      <div className="w-full max-w-md bg-neutral-950 min-h-screen shadow-2xl flex flex-col relative pb-6 scrollbar-none">
        {/* Top Header with Initials, Name, Dept & Dropdown */}
        <StudentHeader
          name={studentInfo.name}
          pid={studentInfo.pid}
          overallPercentage={overallPercentage}
          totalPresent={totalPresent}
          totalClasses={totalClasses}
          onOpenPasswordModal={() => setShowPasswordModal(true)}
          onSelectView={(v) => setCurrentView(v as StudentView)}
          currentView={currentView}
        />

        {/* Modular Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
          {currentView === "home" && (
            <DashboardGrid
              onSelectView={(view) => setCurrentView(view)}
              overallPercentage={overallPercentage}
            />
          )}

          {currentView === "attendance" && (
            <AttendanceView
              subjects={subjects}
              attendanceHistory={attendanceHistory}
              totalClasses={totalClasses}
              totalPresent={totalPresent}
              overallPercentage={overallPercentage}
              isLoading={isLoading}
              onBack={() => setCurrentView("home")}
            />
          )}

          {currentView === "timetable" && (
            <TimetableView onBack={() => setCurrentView("home")} />
          )}

          {currentView === "holidays" && (
            <HolidayView onBack={() => setCurrentView("home")} />
          )}

          {currentView === "assignments" && (
            <AssignmentView onBack={() => setCurrentView("home")} />
          )}

          {currentView === "materials" && (
            <StudyMaterialView onBack={() => setCurrentView("home")} />
          )}

          {currentView === "papers" && (
            <OldPapersView onBack={() => setCurrentView("home")} />
          )}

          {currentView === "memories" && (
            <MemoriesView onBack={() => setCurrentView("home")} />
          )}

          {/* Temporarily commented out until full credits details are finalized
          {currentView === "credits" && (
            <CreditsView onBack={() => setCurrentView("home")} />
          )}
          */}
        </div>
      </div>

      {/* Password Change Modal */}
      <PasswordModal
        isOpen={showPasswordModal}
        pid={studentInfo.pid}
        onClose={() => setShowPasswordModal(false)}
      />
    </div>
  );
}
