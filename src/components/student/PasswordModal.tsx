"use client";

import React, { useState } from "react";
import { updateStudent } from "@/services/db";

interface PasswordModalProps {
  isOpen: boolean;
  pid: string;
  onClose: () => void;
}

export default function PasswordModal({ isOpen, pid, onClose }: PasswordModalProps) {
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);
    try {
      await updateStudent(pid, { password: newPassword });
      alert("Password updated successfully!");
      setNewPassword("");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to update password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-sm p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-indigo-600"></div>

        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-extrabold text-white tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            Update Password
          </h3>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white bg-neutral-950 p-2 rounded-full transition-colors border border-neutral-800 hover:border-neutral-700"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <p className="text-neutral-400 text-xs mb-5 font-medium leading-relaxed">
          Please enter a secure new password with at least 6 characters.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              autoFocus
              placeholder="Enter new password..."
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 text-white p-3.5 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-sm font-medium placeholder-neutral-700"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || newPassword.length < 6}
            className="w-full bg-white text-black font-bold py-3.5 rounded-xl hover:scale-[1.01] active:scale-98 transition-transform disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)] text-xs flex justify-center items-center"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
            ) : (
              "Confirm New Password"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
