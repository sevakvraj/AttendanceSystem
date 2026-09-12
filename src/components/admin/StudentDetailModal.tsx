"use client";

import React, { useState, useEffect } from "react";
import { Student, updateStudent, removeStudent, toggleBlockStudent } from "@/services/db";

interface StudentDetailModalProps {
  isOpen: boolean;
  student: Student | null;
  stats?: { present: number; total: number };
  onClose: () => void;
  onRefresh: () => Promise<void> | void;
}

export default function StudentDetailModal({
  isOpen,
  student,
  stats,
  onClose,
  onRefresh,
}: StudentDetailModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "security">("details");

  useEffect(() => {
    if (student) {
      setName(student.name || "");
      setEmail(student.email || "");
      setPassword("");
    }
  }, [student]);

  if (!isOpen || !student) return null;

  const presentCount = stats?.present || 0;
  const totalCount = stats?.total || 0;
  const percentage = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 0;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Name cannot be empty.");
      return;
    }

    setIsSaving(true);
    try {
      await updateStudent(student.pid, {
        name: name.trim(),
        email: email.trim(),
      });
      await onRefresh();
      alert("Student details updated successfully!");
    } catch (err) {
      console.error("Error updating student:", err);
      alert("Failed to update student details.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      alert("Please enter a new password.");
      return;
    }

    setIsSaving(true);
    try {
      await updateStudent(student.pid, {
        password: password.trim(),
      });
      setPassword("");
      await onRefresh();
      alert("Password changed successfully!");
    } catch (err) {
      console.error("Error updating password:", err);
      alert("Failed to update password.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleBlock = async () => {
    const nextState = !student.isBlocked;
    const actionText = nextState ? "block" : "unblock";
    if (
      window.confirm(
        `Are you sure you want to ${actionText} ${student.name} (${student.pid})?${
          nextState ? "\nThis student will be prevented from logging into the portal." : "\nThis student will be allowed to log in again."
        }`
      )
    ) {
      setIsSaving(true);
      try {
        await toggleBlockStudent(student.pid, nextState);
        await onRefresh();
        alert(`Student ${nextState ? "blocked" : "unblocked"} successfully.`);
      } catch (err) {
        console.error("Error toggling block state:", err);
        alert("Failed to update block state.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDeletePermanent = async () => {
    if (
      window.confirm(
        `DANGER: Are you sure you want to permanently delete student ${student.name} (${student.pid})?\nThis action CANNOT be undone!`
      )
    ) {
      setIsSaving(true);
      try {
        await removeStudent(student.pid);
        await onRefresh();
        alert("Student permanently deleted.");
        onClose();
      } catch (err) {
        console.error("Error deleting student:", err);
        alert("Failed to delete student.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-all">
      <div 
        className="w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-3xl p-6 text-white shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex justify-between items-start pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black ${
              student.isBlocked 
                ? "bg-neutral-800 text-neutral-400 border border-neutral-700" 
                : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
            }`}>
              {student.name ? student.name.slice(0, 2).toUpperCase() : "ST"}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white flex items-center gap-2">
                {student.name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono text-xs text-neutral-400 font-bold bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                  {student.pid}
                </span>
                {student.isBlocked ? (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/80 uppercase tracking-wider">
                    Blocked by Admin
                  </span>
                ) : (
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 uppercase tracking-wider">
                    Active
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-2 rounded-xl bg-neutral-950 border border-neutral-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Attendance Mini Summary */}
        <div className="bg-neutral-950 p-3.5 rounded-2xl border border-neutral-800 flex justify-between items-center text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-500 block">Class Attendance</span>
            <span className="font-bold text-neutral-300">
              {presentCount} / {totalCount} Attended
            </span>
          </div>
          <div className="text-right">
            <span className={`text-lg font-black ${percentage >= 75 ? "text-emerald-400" : "text-amber-400"}`}>
              {percentage}%
            </span>
          </div>
        </div>

        {/* Tab Selection: Details vs Security */}
        <div className="flex gap-1.5 p-1 bg-neutral-950 rounded-xl border border-neutral-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === "details"
                ? "bg-neutral-800 text-white shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Edit Profile
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("security")}
            className={`flex-1 py-2 rounded-lg transition-all ${
              activeTab === "security"
                ? "bg-neutral-800 text-white shadow-sm"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Security & Access
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "details" ? (
          <form onSubmit={handleSaveProfile} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Student full name"
                className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm outline-none focus:border-neutral-600 transition-all font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@email.com"
                className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm outline-none focus:border-neutral-600 transition-all font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-white hover:bg-neutral-200 text-black font-bold py-3 rounded-xl shadow-md transition-all text-xs disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            {/* Change Password Form */}
            <form onSubmit={handleUpdatePassword} className="space-y-2.5">
              <label className="block text-xs font-semibold text-neutral-400">Change / Reset Password</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  className="flex-1 p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-xs outline-none focus:border-neutral-600 transition-all font-medium"
                  required
                />
                <button
                  type="submit"
                  disabled={isSaving || !password.trim()}
                  className="px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs disabled:opacity-50 transition-colors shrink-0"
                >
                  Set
                </button>
              </div>
            </form>

            {/* Block / Unblock Action */}
            <div className="pt-2 border-t border-neutral-800">
              <label className="block text-xs font-semibold text-neutral-400 mb-2">Account Status Control</label>
              {student.isBlocked ? (
                <button
                  type="button"
                  onClick={handleToggleBlock}
                  disabled={isSaving}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-400 hover:bg-emerald-900/60 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Unblock Student (Restore Login Access)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleToggleBlock}
                  disabled={isSaving}
                  className="w-full py-3 px-4 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-300 hover:bg-amber-900/40 font-bold text-xs flex items-center justify-center gap-2 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  <span>Block Student (Deny Login Access)</span>
                </button>
              )}
            </div>

            {/* Permanent Delete Action */}
            <div className="pt-2 border-t border-neutral-800">
              <button
                type="button"
                onClick={handleDeletePermanent}
                disabled={isSaving}
                className="w-full py-3 px-4 rounded-xl bg-red-950/40 border border-red-900/50 text-red-400 hover:bg-red-900/50 font-bold text-xs flex items-center justify-center gap-2 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Delete Student Permanently</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
