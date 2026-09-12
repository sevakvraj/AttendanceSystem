"use client";

import React, { useState } from "react";
import { Student } from "@/services/db";
import StudentDetailModal from "./StudentDetailModal";

interface StudentsModuleProps {
  newStudent: {
    pid: string;
    name: string;
    password: string;
  };
  setNewStudent: React.Dispatch<React.SetStateAction<{
    pid: string;
    name: string;
    password: string;
  }>>;
  handleAddStudent: (e: React.FormEvent) => void;
  onBack: () => void;
  students: Student[];
  onRefresh: () => Promise<void> | void;
}

export default function StudentsModule({
  newStudent,
  setNewStudent,
  handleAddStudent,
  onBack,
  students,
  onRefresh,
}: StudentsModuleProps) {
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Manage Students</h2>
          <p className="text-xs text-neutral-400 mt-0.5">Register new students & maintain directory</p>
        </div>
        <button 
          onClick={onBack} 
          className="text-sm font-bold text-neutral-400 hover:text-white bg-neutral-900 px-3.5 py-1.5 rounded-xl border border-neutral-800 transition-colors"
        >
          Back
        </button>
      </div>
      
      {/* Add New Student Form */}
      <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 shadow-sm mb-6">
        <h3 className="font-bold text-white mb-4 text-sm flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-purple-500 animate-pulse"></span>
          Add New Student
        </h3>
        <form onSubmit={handleAddStudent} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Student PID *</label>
            <input 
              type="text" 
              placeholder="e.g. 26MCA1001 or MG26001" 
              value={newStudent.pid} 
              onChange={e => setNewStudent({...newStudent, pid: e.target.value})} 
              className="w-full p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium text-sm transition-all uppercase" 
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Full Student Name *</label>
            <input 
              type="text" 
              placeholder="e.g. Rahul Sharma" 
              value={newStudent.name} 
              onChange={e => setNewStudent({...newStudent, name: e.target.value})} 
              className="w-full p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium text-sm transition-all" 
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Default Password *</label>
            <input 
              type="password" 
              placeholder="Initial login password" 
              value={newStudent.password} 
              onChange={e => setNewStudent({...newStudent, password: e.target.value})} 
              className="w-full p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-medium text-sm transition-all" 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3.5 rounded-xl shadow-[0_0_15px_rgba(168,85,247,0.3)] hover:scale-[1.01] transition-all text-sm mt-2"
          >
            Add Student to Database
          </button>
        </form>
      </div>

      {/* Directory of Students */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-white">Enrolled Students</h3>
          <span className="text-xs font-bold text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-lg">
            {students.length} Students
          </span>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {students.map((st) => (
            <div 
              key={st.pid} 
              onClick={() => setSelectedStudent(st)}
              className={`flex justify-between items-center p-3.5 rounded-2xl border transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99] ${
                st.isBlocked
                  ? "bg-neutral-900/60 border-neutral-800 text-neutral-400 opacity-80"
                  : "bg-neutral-900 border-neutral-800 hover:border-neutral-700"
              }`}
            >
              <div>
                <p className="font-bold text-white text-xs flex items-center gap-2">
                  <span>{st.name}</span>
                  {st.isBlocked && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
                      Blocked
                    </span>
                  )}
                </p>
                <p className="text-[10px] font-mono text-neutral-400 mt-0.5">{st.pid}</p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                <span className="text-[11px] font-medium text-neutral-500">Manage</span>
                <svg className="w-3.5 h-3.5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Action & Details Modal */}
      <StudentDetailModal
        isOpen={!!selectedStudent}
        student={selectedStudent}
        onClose={() => setSelectedStudent(null)}
        onRefresh={async () => {
          await onRefresh();
          setSelectedStudent(null);
        }}
      />
    </div>
  );
}
