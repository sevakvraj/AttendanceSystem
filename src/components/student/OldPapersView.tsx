"use client";

import React, { useEffect, useState } from "react";
import { StudyMaterial, getStudyMaterials } from "@/services/db";
import { DRIVE_PAPERS_URL } from "./DashboardGrid";

interface OldPapersViewProps {
  onBack: () => void;
}

export default function OldPapersView({ onBack }: OldPapersViewProps) {
  const [items, setItems] = useState<StudyMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [paperSection, setPaperSection] = useState<"internal" | "external" | "all">("internal");
  const [selectedSubject, setSelectedSubject] = useState<string>("ALL");
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

  useEffect(() => {
    async function loadPapers() {
      try {
        const data = await getStudyMaterials("paper");
        setItems(data);
      } catch (err) {
        console.error("Error loading question papers:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadPapers();
  }, []);

  const internalCount = items.filter(
    (i) =>
      i.paperType === "internal" ||
      i.category?.toLowerCase().includes("mid") ||
      i.title?.toLowerCase().includes("mid") ||
      i.unitOrYear?.toLowerCase().includes("mid")
  ).length;

  const externalCount = items.length - internalCount;

  const filteredItems = items.filter((item) => {
    const isInternal =
      item.paperType === "internal" ||
      item.category?.toLowerCase().includes("mid") ||
      item.title?.toLowerCase().includes("mid") ||
      item.unitOrYear?.toLowerCase().includes("mid");

    if (paperSection === "internal" && !isInternal) return false;
    if (paperSection === "external" && isInternal) return false;

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
        <span className="text-xs font-black uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-purple-400"></span>
          Question Papers
        </span>
      </div>

      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-white font-extrabold text-lg tracking-tight">Old Question Papers</h2>
          <p className="text-neutral-500 text-xs font-bold mt-0.5">Separate Internal & External exam papers</p>
        </div>
        <div className="bg-purple-950/40 border border-purple-800/50 px-3 py-1 rounded-lg text-xs font-bold text-purple-400">
          {isLoading ? "..." : `${filteredItems.length} Papers`}
        </div>
      </div>

      {/* Quick Master Papers Google Drive Shortcut */}
      <a
        href={DRIVE_PAPERS_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 to-neutral-900 border border-purple-800/40 hover:border-purple-500/60 transition-all flex items-center justify-between group shadow-sm"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors flex items-center gap-1.5">
              <span>Master Exam Papers Drive</span>
              <span className="text-[10px] font-semibold text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded">All Years</span>
            </p>
            <p className="text-[10px] text-neutral-400">Folder with past Mid-Sem, University & Remedial papers</p>
          </div>
        </div>
        <svg className="w-4 h-4 text-neutral-500 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>

      {/* DISTINCT TWO SECTIONS: Internal vs External (Eliminating Confusion) */}
      <div className="bg-neutral-900/90 p-1.5 rounded-2xl border border-neutral-800 space-y-1">
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => setPaperSection("internal")}
            className={`py-3 px-3 rounded-xl text-xs font-extrabold transition-all flex flex-col items-center justify-center gap-1 border ${
              paperSection === "internal"
                ? "bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)] scale-[1.01]"
                : "bg-neutral-950 text-neutral-400 border-neutral-800/80 hover:text-white hover:border-neutral-700"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${paperSection === "internal" ? "bg-amber-400 animate-pulse" : "bg-neutral-600"}`}></span>
              <span className="tracking-tight text-sm font-black">Internal Papers</span>
            </div>
            <span className="text-[10px] font-medium opacity-80">
              Mid-Sem / CIA ({internalCount})
            </span>
          </button>

          <button
            onClick={() => setPaperSection("external")}
            className={`py-3 px-3 rounded-xl text-xs font-extrabold transition-all flex flex-col items-center justify-center gap-1 border ${
              paperSection === "external"
                ? "bg-purple-600/25 text-purple-300 border-purple-500/60 shadow-[0_0_15px_rgba(147,51,234,0.2)] scale-[1.01]"
                : "bg-neutral-950 text-neutral-400 border-neutral-800/80 hover:text-white hover:border-neutral-700"
            }`}
          >
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${paperSection === "external" ? "bg-purple-400 animate-pulse" : "bg-neutral-600"}`}></span>
              <span className="tracking-tight text-sm font-black">External Papers</span>
            </div>
            <span className="text-[10px] font-medium opacity-80">
              End-Sem / Univ ({externalCount})
            </span>
          </button>
        </div>

        <button
          onClick={() => setPaperSection("all")}
          className={`w-full py-1 text-[11px] font-bold text-center rounded-lg transition-colors ${
            paperSection === "all"
              ? "text-white bg-neutral-800"
              : "text-neutral-500 hover:text-neutral-300"
          }`}
        >
          View All Combined ({items.length} Papers)
        </button>
      </div>

      {/* Subject Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
        {subjectFilters.map((sub) => (
          <button
            key={sub.code}
            onClick={() => setSelectedSubject(sub.code)}
            className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all border ${
              selectedSubject === sub.code
                ? paperSection === "internal"
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/50"
                  : "bg-purple-600/25 text-purple-300 border-purple-500/50"
                : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700 hover:text-white"
            }`}
          >
            {sub.label}
          </button>
        ))}
      </div>

      {/* Search Input */}
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
          placeholder={`Search ${paperSection === "internal" ? "Internal (Mid-Sem)" : paperSection === "external" ? "External (End-Sem)" : ""} papers by subject or year...`}
          className="w-full pl-9 pr-3 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs placeholder-neutral-500 outline-none focus:border-purple-500/60 transition-all font-medium shadow-inner"
        />
      </div>

      {/* List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 space-y-3">
          <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          <p className="text-xs font-bold text-neutral-500">Loading exam papers...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-neutral-900/60 border border-neutral-800/80 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-neutral-800/80 flex items-center justify-center text-neutral-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-neutral-200">
              No {paperSection === "internal" ? "Internal (Mid-Sem)" : paperSection === "external" ? "External (End-Sem)" : ""} Papers Found
            </h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-xs mx-auto">
              {searchQuery || selectedSubject !== "ALL"
                ? "No exam papers match your filter criteria. Try clearing filters."
                : "No papers uploaded in this section yet. You can still access the Master Exam Papers Drive above."}
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const isInternal =
              item.paperType === "internal" ||
              item.category?.toLowerCase().includes("mid") ||
              item.title?.toLowerCase().includes("mid") ||
              item.unitOrYear?.toLowerCase().includes("mid");

            return (
              <div
                key={item.id}
                className={`p-4 rounded-2xl bg-neutral-900 border transition-all shadow-sm ${
                  isInternal
                    ? "border-neutral-800 hover:border-amber-500/50"
                    : "border-neutral-800 hover:border-purple-500/50"
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded uppercase tracking-wider ${
                        isInternal
                          ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                          : "bg-purple-600/20 text-purple-300 border border-purple-500/30"
                      }`}
                    >
                      {isInternal ? "Internal • Mid-Sem" : "External • End-Sem"}
                    </span>
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      {item.code || item.subject}
                    </span>
                    {item.unitOrYear && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-950 text-neutral-300 border border-neutral-800">
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
                    className={`font-bold flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:scale-105 transition-all text-xs border ${
                      isInternal
                        ? "text-amber-300 bg-amber-950/40 border-amber-800/50 hover:bg-amber-900/40"
                        : "text-purple-300 bg-purple-950/40 border-purple-800/50 hover:bg-purple-900/40"
                    }`}
                  >
                    <span>Open Paper</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
