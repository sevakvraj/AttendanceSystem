"use client";

import React, { useEffect, useState } from "react";
import { StudyMaterial, getStudyMaterials } from "@/services/db";
import { DRIVE_MATERIAL_URL } from "./DashboardGrid";

interface StudyMaterialViewProps {
  onBack: () => void;
}

export default function StudyMaterialView({ onBack }: StudyMaterialViewProps) {
  const [items, setItems] = useState<StudyMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const subjectFilters = [
    { code: "ALL", label: "All Subjects" },
    { code: "C54", label: "OS" },
    { code: "C52", label: "CN" },
    { code: "C53", label: "DBMS" },
    { code: "C51", label: "Python" },
    { code: "C55", label: "Comp Fund" },
    { code: "LAB", label: "Lab" },
  ];

  const categories = ["ALL", "Lecture Notes", "PPT Slides", "Lab Manual", "Reference Book", "Syllabus"];

  useEffect(() => {
    async function loadMaterials() {
      try {
        const data = await getStudyMaterials("material");
        setItems(data);
      } catch (err) {
        console.error("Error loading study materials:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadMaterials();
  }, []);

  const filteredItems = items.filter((item) => {
    if (selectedCategory !== "ALL" && item.category !== selectedCategory) return false;

    if (selectedSubject !== "ALL") {
      const codeMatches = item.code && item.code.toUpperCase() === selectedSubject;
      const subMatches =
        (selectedSubject === "C54" && item.subject.toLowerCase().includes("operating")) ||
        (selectedSubject === "C52" && item.subject.toLowerCase().includes("network")) ||
        (selectedSubject === "C53" && item.subject.toLowerCase().includes("dbms")) ||
        (selectedSubject === "C51" && item.subject.toLowerCase().includes("python")) ||
        (selectedSubject === "C55" && item.subject.toLowerCase().includes("fundamental")) ||
        (selectedSubject === "LAB" && item.subject.toLowerCase().includes("lab"));
      if (!codeMatches && !subMatches) return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchSubject = item.subject.toLowerCase().includes(q);
      const matchUnit = item.unitOrYear && item.unitOrYear.toLowerCase().includes(q);
      const matchFaculty = item.faculty && item.faculty.toLowerCase().includes(q);
      const matchCategory = item.category && item.category.toLowerCase().includes(q);
      if (!matchTitle && !matchSubject && !matchUnit && !matchFaculty && !matchCategory) return false;
    }

    return true;
  });

  return (
    <div className="space-y-4 pb-6">
      {/* Header */}
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
        <span className="text-xs font-black uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          Study Material
        </span>
      </div>

      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-white font-extrabold text-lg tracking-tight">MCA Study Materials</h2>
          <p className="text-neutral-500 text-xs font-bold mt-0.5">Unit notes, lecture slides & references</p>
        </div>
        <div className="bg-blue-950/40 border border-blue-800/50 px-3 py-1 rounded-lg text-xs font-bold text-blue-400">
          {isLoading ? "..." : `${filteredItems.length} Notes`}
        </div>
      </div>

      {/* Quick Google Drive Master Folder Shortcut */}
      <a
        href={DRIVE_MATERIAL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/40 to-neutral-900 border border-blue-800/40 hover:border-blue-500/60 transition-all flex items-center justify-between group shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors flex items-center gap-1.5">
              <span>Master Materials Drive</span>
              <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">All Units</span>
            </p>
            <p className="text-[10px] text-neutral-400">Direct cloud access to PPTs, textbook PDFs & lab code</p>
          </div>
        </div>
        <svg className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>

      {/* Subject Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {subjectFilters.map((sub) => (
          <button
            key={sub.code}
            onClick={() => setSelectedSubject(sub.code)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
              selectedSubject === sub.code
                ? "bg-blue-600 text-white border-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.3)]"
                : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white"
            }`}
          >
            {sub.label}
          </button>
        ))}
      </div>

      {/* Category Pills (Lecture Notes, PPTs, Lab Manual, etc.) */}
      <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat
                ? "bg-neutral-800 text-white border-neutral-600"
                : "bg-neutral-950 text-neutral-500 border-neutral-800/80 hover:text-neutral-300"
            }`}
          >
            {cat === "ALL" ? "All Categories" : cat}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by topic, unit, faculty, or title..."
          className="w-full pl-9 pr-3 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs placeholder-neutral-500 outline-none focus:border-blue-500/60 transition-all font-medium shadow-inner"
        />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-3">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          <p className="text-xs font-bold text-neutral-500">Loading study materials...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-neutral-900/60 border border-neutral-800/80 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-neutral-800/80 flex items-center justify-center text-neutral-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-200">No Study Materials Found</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
              {searchQuery || selectedSubject !== "ALL" || selectedCategory !== "ALL"
                ? "No notes match your filter. Try adjusting your search query."
                : "No material uploaded yet. You can still access the Master Materials Drive above."}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-blue-950 text-blue-300 border border-blue-800/60">
                    {item.category || "Notes"}
                  </span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                    {item.code || item.subject}
                  </span>
                  {item.unitOrYear && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                      {item.unitOrYear}
                    </span>
                  )}
                </div>
              </div>

              <h3 className="font-bold text-white text-sm mb-1">{item.title}</h3>
              {item.description && (
                <p className="text-xs text-neutral-400 mb-2">{item.description}</p>
              )}

              <div className="flex justify-between items-center mt-3 pt-3 border-t border-neutral-800/60 text-xs">
                <div className="text-neutral-400 text-[11px]">
                  {item.faculty ? (
                    <span>Faculty: <strong className="text-neutral-200">{item.faculty}</strong></span>
                  ) : (
                    <span>Subject: <strong className="text-neutral-200">{item.subject}</strong></span>
                  )}
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5 bg-blue-950/40 border border-blue-800/50 px-3 py-1.5 rounded-xl hover:scale-105 transition-all text-xs"
                >
                  <span>Open Notes</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
