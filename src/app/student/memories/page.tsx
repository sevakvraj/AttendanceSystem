"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface PhotoItem {
  id: number;
  order: number;
  displayId: string;
  title: string;
  tag: string;
  category: "all" | "freshers";
  image: string;
  date: string;
  caption: string;
}

// Strictly ordered by ID sequence 1, 2, 3, 4, 5, 6
const INITIAL_PHOTOS: PhotoItem[] = [
  {
    id: 1,
    order: 1,
    displayId: "01",
    title: 'console.write("welcome"); 🍫',
    tag: "FRESHERS '26",
    category: "freshers",
    image: "/images/Feleshepic/WhatsApp%20Image%202026-09-12%20at%209.35.04%20PM.jpeg",
    date: "September 2026",
    caption: "Handmade floral welcome card with sweet chocolate gift for MCA '26",
  },
  {
    id: 2,
    order: 2,
    displayId: "02",
    title: "Party Hall Squad 🌟",
    tag: "FRESHERS '26",
    category: "freshers",
    image: "/images/Feleshepic/IMG_0042.JPG",
    date: "September 2026",
    caption: "Dressed to impress for our grand Freshers celebration",
  },
  {
    id: 3,
    order: 3,
    displayId: "03",
    title: "CRUD Fresher's '26 ✨",
    tag: "FRESHERS '26",
    category: "freshers",
    image: "/images/Feleshepic/IMG_0045.JPG",
    date: "September 2026",
    caption: "Golden balloons, silver sparkles, and smiles on the main stage",
  },
  {
    id: 4,
    order: 4,
    displayId: "04",
    title: "Squad Goals on Stage 📸",
    tag: "FRESHERS '26",
    category: "freshers",
    image: "/images/Feleshepic/IMG_0051.JPG",
    date: "September 2026",
    caption: "MCA batch squad capturing unforgettable moments together",
  },
  {
    id: 5,
    order: 5,
    displayId: "05",
    title: "MCA Class of 26-27 ✨",
    tag: "FRESHERS '26",
    category: "freshers",
    image: "/images/Feleshepic/IMG_0053.JPG",
    date: "September 2026",
    caption: "The full crew celebrating the start of an amazing journey",
  },
  {
    id: 6,
    order: 6,
    displayId: "06",
    title: "Hands in the Air! 🥳",
    tag: "FRESHERS '26",
    category: "freshers",
    image: "/images/Feleshepic/WhatsApp%20Image%202026-09-12%20at%209.41.29%20PM.jpeg",
    date: "September 2026",
    caption: "The entire MCA batch celebrating under the chandelier with endless energy",
  },
];

const CATEGORIES = [
  { id: "all", label: "ALL" },
  { id: "freshers", label: "FRESHERS" },
];

export default function StudentMemoriesPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [photos, setPhotos] = useState<PhotoItem[]>(INITIAL_PHOTOS);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // Sync dynamic photos from /api/memories strictly sorted by ID sequence (1, 2, 3, 4, 5, 6...)
  useEffect(() => {
    fetch("/api/memories")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.photos && Array.isArray(data.photos) && data.photos.length > 0) {
          const sorted = [...data.photos].sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0));
          setPhotos(sorted);
        }
      })
      .catch(() => {});
  }, []);

  // Keyboard navigation for full-screen modal
  useEffect(() => {
    if (selectedIndex === null) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const filteredPhotos =
    activeCategory === "all"
      ? photos
      : photos.filter((p) => p.category === activeCategory);

  const selectedPhoto =
    selectedIndex !== null && filteredPhotos[selectedIndex]
      ? filteredPhotos[selectedIndex]
      : null;

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % filteredPhotos.length);
    }
  };

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex(
        (selectedIndex - 1 + filteredPhotos.length) % filteredPhotos.length
      );
    }
  };

  // Two columns for Pinterest masonry layout:
  // Col 1 receives IDs 1, 3, 5... (Row 1 Left, Row 2 Left, Row 3 Left...)
  // Col 2 receives IDs 2, 4, 6... (Row 1 Right, Row 2 Right, Row 3 Right...)
  const col1 = filteredPhotos.filter((_, i) => i % 2 === 0);
  const col2 = filteredPhotos.filter((_, i) => i % 2 === 1);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-amber-500/20 selection:text-amber-300 scrollbar-none antialiased">
      {/* Container with optimal reading & gallery width */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-7 sm:space-y-9">
        {/* Top Navigation Bar */}
        <header className="flex items-center justify-between">
          <Link
            href="/student"
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-neutral-900/80 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 text-xs font-semibold transition-all group cursor-pointer"
          >
            <svg
              className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
            </svg>
            <span>Dashboard</span>
          </Link>

          <span className="text-[10px] tracking-widest font-bold uppercase text-amber-400 bg-amber-950/40 px-3.5 py-1.5 rounded-full border border-amber-500/30 shadow-sm">
            Vault &bull; MCA &apos;26-&apos;27
          </span>
        </header>

        {/* Cinematic Editorial Header */}
        <div className="space-y-3 pt-2">
          <h1 className="text-4xl sm:text-6xl font-serif tracking-tight text-white flex items-baseline gap-2.5">
            <span>The</span>
            <span className="italic font-serif text-amber-400 relative inline-block">
              Archive
              <span className="absolute bottom-0 left-0 w-full h-[2.5px] bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 rounded-full" />
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-md font-sans leading-relaxed">
            A cinematic collection of fleeting moments, frozen in time. Exploring chapters of our batch journey.
          </p>
        </div>

        {/* Minimalist 2-Option Categories (ALL / FRESHERS) */}
        <nav className="flex items-center justify-center gap-8 sm:gap-10 pb-2 pt-1">
          {CATEGORIES.map((tab) => {
            const isActive = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className="flex flex-col items-center group cursor-pointer transition-colors"
              >
                <span
                  className={`text-xs font-bold tracking-widest uppercase transition-colors ${
                    isActive
                      ? "text-amber-400"
                      : "text-neutral-500 hover:text-neutral-300"
                  }`}
                >
                  {tab.label}
                </span>
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-1.5 transition-all duration-300 ${
                    isActive
                      ? "bg-amber-400 scale-100 opacity-100 shadow-sm shadow-amber-400/80"
                      : "bg-transparent scale-0 opacity-0"
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* True Two-Column Masonry Stream (Edge-to-Edge Free Height) */}
        {filteredPhotos.length === 0 ? (
          <div className="py-20 text-center text-neutral-500 text-xs font-mono">
            No memories in this chapter yet.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3.5 sm:gap-5 pb-12">
            {/* Column 1 (Left) */}
            <div className="flex flex-col space-y-3.5 sm:space-y-5">
              {col1.map((photo) => {
                const originalIndex = filteredPhotos.findIndex((p) => p.id === photo.id);
                return (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedIndex(originalIndex)}
                    className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-950 border border-white/5 hover:border-amber-400/80 shadow-lg hover:shadow-2xl hover:shadow-amber-400/15 transition-all duration-300 cursor-pointer"
                  >
                    {/* Natural Aspect Ratio Photo (Free Size) */}
                    <img
                      src={photo.image}
                      alt={photo.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto object-cover block group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                    />

                    {/* Dark Cinematic Vignette Overlay with Gold Tag */}
                    <div className="absolute inset-0 bg-black/55 backdrop-blur-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center">
                      <span className="text-[9px] sm:text-[11px] font-semibold tracking-[0.2em] text-amber-300/90 uppercase mb-2">
                        TAP TO VIEW
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-400/60 text-amber-300 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        {photo.tag}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Column 2 */}
            <div className="flex flex-col space-y-3.5 sm:space-y-5">
              {col2.map((photo) => {
                const originalIndex = filteredPhotos.findIndex((p) => p.id === photo.id);
                return (
                  <div
                    key={photo.id}
                    onClick={() => setSelectedIndex(originalIndex)}
                    className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-neutral-950 border border-white/5 hover:border-amber-400/80 shadow-lg hover:shadow-2xl hover:shadow-amber-400/15 transition-all duration-300 cursor-pointer"
                  >
                    {/* Natural Aspect Ratio Photo (Free Size) */}
                    <img
                      src={photo.image}
                      alt={photo.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-auto object-cover block group-hover:scale-[1.03] transition-transform duration-500 ease-out"
                    />

                    {/* Dark Cinematic Vignette Overlay with Gold Tag */}
                    <div className="absolute inset-0 bg-black/55 backdrop-blur-[1.5px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-3 text-center">
                      <span className="text-[9px] sm:text-[11px] font-semibold tracking-[0.2em] text-amber-300/90 uppercase mb-2">
                        TAP TO VIEW
                      </span>
                      <span className="px-3 py-1 rounded-full bg-amber-950/80 border border-amber-400/60 text-amber-300 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        {photo.tag}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Fullscreen High-Definition Lightbox Modal */}
      {selectedPhoto && selectedIndex !== null && (
        <div
          onClick={() => setSelectedIndex(null)}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-fade-in cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-neutral-950 border border-neutral-800 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col cursor-default max-h-[94vh]"
          >
            {/* Modal Header */}
            <div className="p-3.5 sm:p-4 border-b border-neutral-900 flex items-center justify-between bg-black/80">
              <div className="flex items-center space-x-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 bg-amber-950/50 px-3 py-1 rounded-full border border-amber-500/40">
                  {selectedPhoto.tag}
                </span>
                <span className="text-[11px] text-neutral-400 font-mono">
                  {selectedIndex + 1} / {filteredPhotos.length}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {/* Download Button */}
                <a
                  href={selectedPhoto.image}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-xs font-semibold text-neutral-200 inline-flex items-center space-x-1.5 transition-colors cursor-pointer"
                  title="Download High-Res Original"
                >
                  <svg className="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Download</span>
                </a>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedIndex(null)}
                  className="w-8 h-8 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Close (Esc)"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Centered High-Res Image with Prev / Next */}
            <div className="relative w-full flex-1 min-h-[340px] max-h-[70vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="max-w-full max-h-[70vh] object-contain select-none"
              />

              {/* Prev Button */}
              {filteredPhotos.length > 1 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-neutral-950/80 hover:bg-neutral-900 border border-white/10 text-white backdrop-blur-md transition-transform hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
                  title="Previous (Left Arrow)"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Next Button */}
              {filteredPhotos.length > 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-neutral-950/80 hover:bg-neutral-900 border border-white/10 text-white backdrop-blur-md transition-transform hover:scale-110 active:scale-95 cursor-pointer shadow-lg"
                  title="Next (Right Arrow)"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-neutral-950 border-t border-neutral-900 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white tracking-tight">
                  {selectedPhoto.title}
                </h3>
                <span className="text-[11px] font-mono text-neutral-500">
                  {selectedPhoto.date}
                </span>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">
                {selectedPhoto.caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
