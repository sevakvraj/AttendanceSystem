"use client";

import React from "react";
import { CustomSlot } from "@/services/db";

interface TimetableModuleProps {
  customSlots: CustomSlot[];
  isSlotsLoading: boolean;
  newSlot: {
    day: CustomSlot["day"];
    date: string;
    time: string;
    timeStart: string;
    subject: string;
    code: string;
    faculty: string;
    type: "Lecture" | "Lab";
  };
  setNewSlot: React.Dispatch<React.SetStateAction<{
    day: CustomSlot["day"];
    date: string;
    time: string;
    timeStart: string;
    subject: string;
    code: string;
    faculty: string;
    type: "Lecture" | "Lab";
  }>>;
  isSubmittingSlot: boolean;
  handleAddSlot: (e: React.FormEvent) => void;
  handleDeleteSlot: (id: string, subject: string, time: string) => void;
  onBack: () => void;
}

export default function TimetableModule({
  customSlots,
  isSlotsLoading,
  newSlot,
  setNewSlot,
  isSubmittingSlot,
  handleAddSlot,
  handleDeleteSlot,
  onBack,
}: TimetableModuleProps) {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-xl font-bold text-white">Manage Timetable Slots</h2>
          <p className="text-xs text-neutral-400 mt-0.5">Add, edit, and organize schedule slots</p>
        </div>
        <button
          onClick={onBack}
          className="text-sm font-bold text-neutral-400 hover:text-white bg-neutral-900 px-3.5 py-1.5 rounded-xl border border-neutral-800 transition-colors"
        >
          Back
        </button>
      </div>

      {/* Add New Class Slot Form */}
      <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 shadow-sm">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-neutral-800">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
            +
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Add New Class Slot</h3>
            <p className="text-[11px] text-neutral-400">Slots sync automatically to student timetable and roll call</p>
          </div>
        </div>

        <form onSubmit={handleAddSlot} className="space-y-4">
          {/* Day of Week & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Day of Week *</label>
              <select
                value={newSlot.day}
                onChange={(e) => setNewSlot({ ...newSlot, day: e.target.value as any })}
                className="w-full p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-medium text-sm transition-all"
                required
              >
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                Specific Date <span className="text-neutral-500 font-normal">(Optional)</span>
              </label>
              <input
                type="date"
                value={newSlot.date}
                onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })}
                className="w-full p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-white outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-medium text-sm transition-all"
              />
            </div>
          </div>

          {/* Quick Subject Select & Course Code */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Subject *</label>
              <input
                type="text"
                placeholder="e.g. Operating System"
                value={newSlot.subject}
                onChange={(e) => setNewSlot({ ...newSlot, subject: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-medium text-sm transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Code *</label>
              <input
                type="text"
                placeholder="e.g. C54"
                value={newSlot.code}
                onChange={(e) => setNewSlot({ ...newSlot, code: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-medium text-sm transition-all uppercase"
                required
              />
            </div>
          </div>

          {/* Preset quick subjects picker pills */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {[
              { name: "Operating System", code: "C54", faculty: "Prof. VLD" },
              { name: "Computer Network", code: "C52", faculty: "Prof. TMS" },
              { name: "DBMS", code: "C53", faculty: "Prof. JVS" },
              { name: "Python Programming", code: "C51", faculty: "Prof. PPP" },
              { name: "Computer Fundamental", code: "C55", faculty: "Prof. AAP" },
              { name: "Practical Lab", code: "LAB", faculty: "Lab Faculty" },
            ].map((subj) => (
              <button
                type="button"
                key={subj.code}
                onClick={() =>
                  setNewSlot({
                    ...newSlot,
                    subject: subj.name,
                    code: subj.code,
                    faculty: subj.faculty,
                    type: subj.code === "LAB" ? "Lab" : "Lecture",
                  })
                }
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 hover:border-amber-500/60 hover:text-amber-400 transition-all"
              >
                {subj.code} • {subj.name}
              </button>
            ))}
          </div>

          {/* Faculty & Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Faculty Name *</label>
              <input
                type="text"
                placeholder="e.g. Prof. VLD"
                value={newSlot.faculty}
                onChange={(e) => setNewSlot({ ...newSlot, faculty: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-medium text-sm transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Slot Type *</label>
              <div className="grid grid-cols-2 gap-2 h-[46px]">
                <button
                  type="button"
                  onClick={() => setNewSlot({ ...newSlot, type: "Lecture" })}
                  className={`rounded-xl text-xs font-bold transition-all border ${
                    newSlot.type === "Lecture"
                      ? "bg-blue-600 text-white border-blue-500"
                      : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white"
                  }`}
                >
                  Lecture
                </button>
                <button
                  type="button"
                  onClick={() => setNewSlot({ ...newSlot, type: "Lab" })}
                  className={`rounded-xl text-xs font-bold transition-all border ${
                    newSlot.type === "Lab"
                      ? "bg-teal-600 text-white border-teal-500"
                      : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white"
                  }`}
                >
                  Lab
                </button>
              </div>
            </div>
          </div>

          {/* Time Range */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1">Time Slot *</label>
            <input
              type="text"
              placeholder="e.g. 5:30 PM - 6:30 PM"
              value={newSlot.time}
              onChange={(e) => setNewSlot({ ...newSlot, time: e.target.value })}
              className="w-full p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 font-medium text-sm transition-all"
              required
            />
            <div className="flex gap-2 mt-2">
              {["5:30 PM - 6:30 PM", "6:30 PM - 7:30 PM", "9:30 AM - 10:30 AM"].map((timePreset) => (
                <button
                  type="button"
                  key={timePreset}
                  onClick={() => setNewSlot({ ...newSlot, time: timePreset })}
                  className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-neutral-200"
                >
                  {timePreset}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmittingSlot}
            className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black py-3.5 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:scale-[1.01] transition-all text-sm mt-2 disabled:opacity-50"
          >
            {isSubmittingSlot ? "Saving Slot..." : "+ Add Slot to Timetable"}
          </button>
        </form>
      </div>

      {/* Active Custom Timetable Slots */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-white">Active Custom Slots</h3>
          <span className="text-xs font-bold text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-lg">
            {customSlots.length} {customSlots.length === 1 ? "Slot" : "Slots"}
          </span>
        </div>

        {isSlotsLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full"></div>
          </div>
        ) : customSlots.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
            <p className="text-sm font-bold text-neutral-300">No custom slots added yet</p>
            <p className="text-xs text-neutral-500 mt-1">
              Slots created above appear in weekly timetables, attendance views, and roll call dropdowns.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {customSlots.map((slot) => (
              <div
                key={slot.id}
                className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all shadow-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {slot.day} {slot.date ? `(${slot.date})` : "(Weekly)"}
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      {slot.code}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        slot.type === "Lab"
                          ? "bg-teal-950/80 text-teal-300 border border-teal-800/50"
                          : "bg-blue-950/80 text-blue-300 border border-blue-800/50"
                      }`}
                    >
                      {slot.type}
                    </span>
                  </div>

                  <button
                    onClick={() => slot.id && handleDeleteSlot(slot.id, slot.subject, slot.time)}
                    className="text-red-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-950/50 transition-colors"
                    title="Delete Slot"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <h4 className="font-bold text-white text-sm">{slot.subject}</h4>

                <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-neutral-800/60 text-xs text-neutral-400">
                  <div>
                    Faculty: <strong className="text-neutral-200">{slot.faculty}</strong>
                  </div>
                  <div className="font-mono text-neutral-300 text-[11px] bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                    {slot.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
