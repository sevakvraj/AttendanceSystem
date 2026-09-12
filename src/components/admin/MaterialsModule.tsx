"use client";

import React, { useState, useEffect } from "react";
import { StudyMaterial, addStudyMaterial, getStudyMaterials, deleteStudyMaterial } from "@/services/db";

interface MaterialsModuleProps {
  onBack: () => void;
}

export default function MaterialsModule({ onBack }: MaterialsModuleProps) {
  const [items, setItems] = useState<StudyMaterial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterTab, setFilterTab] = useState<"all" | "material" | "paper">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [newItem, setNewItem] = useState<{
    title: string;
    type: "material" | "paper";
    paperType: "internal" | "external";
    category: string;
    subject: string;
    code: string;
    unitOrYear: string;
    url: string;
    faculty: string;
    description: string;
  }>({
    title: "",
    type: "material",
    paperType: "internal",
    category: "Lecture Notes",
    subject: "Operating System",
    code: "C54",
    unitOrYear: "Unit 1",
    url: "",
    faculty: "Prof. VLD",
    description: "",
  });

  const subjectPresets = [
    { name: "Operating System", code: "C54", faculty: "Prof. VLD" },
    { name: "Computer Network", code: "C52", faculty: "Prof. TMS" },
    { name: "DBMS", code: "C53", faculty: "Prof. JVS" },
    { name: "Python Programming", code: "C51", faculty: "Prof. PPP" },
    { name: "Computer Fundamental", code: "C55", faculty: "Prof. AAP" },
    { name: "Practical Lab", code: "LAB", faculty: "Lab Faculty" },
  ];

  const materialCategories = ["Lecture Notes", "PPT Slides", "Lab Manual", "Reference Book", "Syllabus"];
  const paperCategories = ["Mid-Sem Exam", "End-Sem Exam", "Previous Year Paper", "Sample Paper"];

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const data = await getStudyMaterials();
      setItems(data);
    } catch (err) {
      console.error("Error loading study materials & papers:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title.trim() || !newItem.subject.trim() || !newItem.url.trim()) {
      alert("Please fill in Title, Subject, and Document Link.");
      return;
    }

    setIsSubmitting(true);
    try {
      const facultyFormatted =
        newItem.faculty.trim().startsWith("Prof.") || newItem.faculty.trim() === "Lab Faculty"
          ? newItem.faculty.trim()
          : newItem.faculty.trim() ? `Prof. ${newItem.faculty.trim()}` : "";

      await addStudyMaterial({
        title: newItem.title.trim(),
        type: newItem.type,
        paperType: newItem.type === "paper" ? newItem.paperType : undefined,
        category: newItem.category.trim(),
        subject: newItem.subject.trim(),
        code: newItem.code.trim().toUpperCase() || "C50",
        unitOrYear: newItem.unitOrYear.trim(),
        url: newItem.url.trim(),
        faculty: facultyFormatted,
        description: newItem.description.trim(),
      });

      setNewItem({
        title: "",
        type: newItem.type,
        paperType: newItem.paperType,
        category: newItem.type === "material" ? "Lecture Notes" : newItem.paperType === "internal" ? "Mid-Sem Exam" : "End-Sem Exam",
        subject: newItem.subject,
        code: newItem.code,
        unitOrYear: newItem.type === "material" ? "Unit 1" : newItem.paperType === "internal" ? "Mid-Sem 2025" : "Winter 2025",
        url: "",
        faculty: newItem.faculty,
        description: "",
      });

      await loadItems();
      alert(`${newItem.type === "material" ? "Study Material" : "Exam Paper"} saved successfully!`);
    } catch (err) {
      console.error("Error adding document:", err);
      alert("Failed to save document.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to remove "${title}"?`)) {
      try {
        await deleteStudyMaterial(id);
        setItems((prev) => prev.filter((item) => item.id !== id));
      } catch (err) {
        console.error("Error deleting item:", err);
        alert("Failed to delete item.");
      }
    }
  };

  const filteredItems = items.filter((item) => {
    if (filterTab !== "all" && item.type !== filterTab) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.subject.toLowerCase().includes(q) ||
      (item.code && item.code.toLowerCase().includes(q)) ||
      (item.faculty && item.faculty.toLowerCase().includes(q)) ||
      (item.unitOrYear && item.unitOrYear.toLowerCase().includes(q))
    );
  });

  return (
    <div className="p-6 space-y-6">
      {/* Top Header */}
      <div className="flex justify-between items-center mb-2">
        <div>
          <h2 className="text-xl font-bold text-white">Manage Materials & Papers</h2>
          <p className="text-xs text-neutral-400 mt-0.5">Upload and organize study notes, slides & exam papers</p>
        </div>
        <button
          onClick={onBack}
          className="text-sm font-bold text-neutral-400 hover:text-white bg-neutral-900 px-3.5 py-1.5 rounded-xl border border-neutral-800 transition-colors"
        >
          Back
        </button>
      </div>

      {/* Add Material / Paper Form */}
      <div className="bg-neutral-900 p-5 rounded-2xl border border-neutral-800 shadow-sm">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
            <h3 className="font-bold text-white text-sm">Add New Resource</h3>
          </div>
          <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
            Synced to Student Portal
          </span>
        </div>

        <form onSubmit={handleAdd} className="space-y-4">
          {/* Resource Type Toggle */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1.5">Resource Type *</label>
            <div className="grid grid-cols-2 gap-2 h-11">
              <button
                type="button"
                onClick={() =>
                  setNewItem({
                    ...newItem,
                    type: "material",
                    category: "Lecture Notes",
                    unitOrYear: "Unit 1",
                  })
                }
                className={`rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                  newItem.type === "material"
                    ? "bg-blue-600 text-white border-blue-500 shadow-[0_0_12px_rgba(37,99,235,0.3)]"
                    : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span>Study Material</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  setNewItem({
                    ...newItem,
                    type: "paper",
                    category: "Previous Year Paper",
                    unitOrYear: "Winter 2025",
                  })
                }
                className={`rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 ${
                  newItem.type === "paper"
                    ? "bg-purple-600 text-white border-purple-500 shadow-[0_0_12px_rgba(147,51,234,0.3)]"
                    : "bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Exam / Old Paper</span>
              </button>
            </div>
          </div>

          {/* Internal vs External Paper Toggle (Only when paper is selected) */}
          {newItem.type === "paper" && (
            <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 space-y-2">
              <label className="block text-xs font-semibold text-neutral-300">
                Exam Section *
              </label>
              <div className="grid grid-cols-2 gap-2 h-10">
                <button
                  type="button"
                  onClick={() =>
                    setNewItem({
                      ...newItem,
                      paperType: "internal",
                      category: "Mid-Sem Exam",
                      unitOrYear: "Mid-Sem 2025",
                    })
                  }
                  className={`rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                    newItem.paperType === "internal"
                      ? "bg-amber-500 text-neutral-950 border-amber-400 font-extrabold shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                      : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>Internal (Mid-Sem)</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setNewItem({
                      ...newItem,
                      paperType: "external",
                      category: "End-Sem Exam",
                      unitOrYear: "Winter 2025",
                    })
                  }
                  className={`rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                    newItem.paperType === "external"
                      ? "bg-purple-600 text-white border-purple-500 font-extrabold shadow-[0_0_12px_rgba(147,51,234,0.3)]"
                      : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  <span>External (End-Sem)</span>
                </button>
              </div>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1">
              Document / Paper Title *
            </label>
            <input
              type="text"
              placeholder={newItem.type === "material" ? "e.g. Unit 1: Process Synchronization Notes" : newItem.paperType === "internal" ? "e.g. MCA Mid-Sem Exam 2025 Question Paper" : "e.g. Winter 2024 End-Sem University Paper"}
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              className="w-full p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-medium text-sm transition-all"
              required
            />
          </div>

          {/* Subject & Code */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Subject *</label>
              <input
                type="text"
                placeholder="e.g. Operating System"
                value={newItem.subject}
                onChange={(e) => setNewItem({ ...newItem, subject: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-medium text-sm transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Code *</label>
              <input
                type="text"
                placeholder="e.g. C54"
                value={newItem.code}
                onChange={(e) => setNewItem({ ...newItem, code: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-medium text-sm transition-all uppercase"
                required
              />
            </div>
          </div>

          {/* Quick Subject Picker Pills */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {subjectPresets.map((subj) => (
              <button
                type="button"
                key={subj.code}
                onClick={() =>
                  setNewItem({
                    ...newItem,
                    subject: subj.name,
                    code: subj.code,
                    faculty: subj.faculty,
                  })
                }
                className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-neutral-300 hover:border-cyan-500/60 hover:text-cyan-400 transition-all"
              >
                {subj.code} • {subj.name}
              </button>
            ))}
          </div>

          {/* Category & Unit/Year */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Category *</label>
              <select
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-medium text-sm transition-all"
              >
                {(newItem.type === "material" ? materialCategories : paperCategories).map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">
                {newItem.type === "material" ? "Unit / Topic" : "Exam Year / Term"} *
              </label>
              <input
                type="text"
                placeholder={newItem.type === "material" ? "e.g. Unit 1" : "e.g. Winter 2025"}
                value={newItem.unitOrYear}
                onChange={(e) => setNewItem({ ...newItem, unitOrYear: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-medium text-sm transition-all"
                required
              />
            </div>
          </div>

          {/* Document URL / Drive Link */}
          <div>
            <label className="block text-xs font-semibold text-neutral-400 mb-1">
              Document Link (Google Drive, Cloud PDF, or Doc URL) *
            </label>
            <input
              type="url"
              placeholder="https://drive.google.com/... or https://..."
              value={newItem.url}
              onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
              className="w-full p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-medium text-sm transition-all font-mono"
              required
            />
          </div>

          {/* Faculty Name & Optional Description */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Faculty / Author</label>
              <input
                type="text"
                placeholder="e.g. Prof. VLD"
                value={newItem.faculty}
                onChange={(e) => setNewItem({ ...newItem, faculty: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-medium text-sm transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-400 mb-1">Notes / Description (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Includes 70 marks questions"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="w-full p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-medium text-sm transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-neutral-950 font-black py-3.5 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-[1.01] transition-all text-sm mt-2 disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : `+ Add ${newItem.type === "material" ? "Study Material" : "Exam Paper"}`}
          </button>
        </form>
      </div>

      {/* Active Materials & Papers List */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-white">Added Materials & Papers</h3>
          <span className="text-xs font-bold text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-lg">
            {filteredItems.length} {filteredItems.length === 1 ? "Item" : "Items"}
          </span>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="space-y-2 mb-4">
          <div className="flex gap-2">
            <button
              onClick={() => setFilterTab("all")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                filterTab === "all"
                  ? "bg-white text-black border-white"
                  : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white"
              }`}
            >
              All ({items.length})
            </button>
            <button
              onClick={() => setFilterTab("material")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                filterTab === "material"
                  ? "bg-blue-600 text-white border-blue-500"
                  : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white"
              }`}
            >
              Materials ({items.filter((i) => i.type === "material").length})
            </button>
            <button
              onClick={() => setFilterTab("paper")}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                filterTab === "paper"
                  ? "bg-purple-600 text-white border-purple-500"
                  : "bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white"
              }`}
            >
              Papers ({items.filter((i) => i.type === "paper").length})
            </button>
          </div>

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
              placeholder="Search by title, subject, unit, year, or faculty..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-xs placeholder-neutral-500 outline-none focus:border-neutral-600 transition-all font-medium"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-neutral-900/60 border border-neutral-800/80">
            <p className="text-sm font-bold text-neutral-300">No items found</p>
            <p className="text-xs text-neutral-500 mt-1">
              {searchQuery ? "No matching materials or papers." : "Add materials and exam papers above to share them with students."}
            </p>
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
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        item.type === "material"
                          ? "bg-blue-950 text-blue-300 border border-blue-800/60"
                          : "bg-purple-950 text-purple-300 border border-purple-800/60"
                      }`}
                    >
                      {item.type === "material" ? "Material" : "Paper"}
                    </span>
                    {item.type === "paper" && item.paperType && (
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase tracking-wider ${
                          item.paperType === "internal"
                            ? "bg-amber-950/80 text-amber-300 border border-amber-800/60"
                            : "bg-purple-950/80 text-purple-300 border border-purple-800/60"
                        }`}
                      >
                        {item.paperType === "internal" ? "Internal" : "External"}
                      </span>
                    )}
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      {item.code || item.subject}
                    </span>
                    {item.category && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-neutral-400">
                        {item.category}
                      </span>
                    )}
                    {item.unitOrYear && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {item.unitOrYear}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => item.id && handleDelete(item.id, item.title)}
                    className="text-red-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-950/50 transition-colors"
                    title="Delete"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                <h4 className="font-bold text-white text-sm mb-1">{item.title}</h4>
                {item.description && (
                  <p className="text-xs text-neutral-400 mb-2">{item.description}</p>
                )}

                <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-neutral-800/60 text-xs text-neutral-400">
                  <div>
                    {item.faculty ? (
                      <span>Faculty: <strong className="text-neutral-200">{item.faculty}</strong></span>
                    ) : (
                      <span className="text-neutral-500">MCA Department</span>
                    )}
                  </div>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1.5 bg-cyan-950/40 border border-cyan-800/50 px-2.5 py-1 rounded-lg hover:scale-105 transition-all text-xs"
                  >
                    <span>Open Document</span>
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
    </div>
  );
}
