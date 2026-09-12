"use client";

import React from "react";
import Image from "next/image";

interface CreditsViewProps {
  onBack: () => void;
}

export default function CreditsView({ onBack }: CreditsViewProps) {
  return (
    <div className="space-y-6 pb-12 animate-fade-in text-white select-none">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-800 text-xs font-semibold transition-all group cursor-pointer"
        >
          <svg
            className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Dashboard</span>
        </button>

        <span className="text-[11px] font-semibold text-purple-300 bg-purple-950/50 px-3.5 py-1 rounded-full border border-purple-800/40 flex items-center space-x-1.5">
          <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          </svg>
          <span>MCA Class of 26-27</span>
        </span>
      </div>

      {/* TOP SECTION: Class Representatives */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2 px-1">
          <span className="text-amber-400 font-bold text-sm">🎓</span>
          <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
            Class Representatives
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {/* Shubhamkumar Prajapati */}
          <div className="p-4.5 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800/90 hover:border-amber-500/40 transition-all flex items-start space-x-3.5 group shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black text-sm shrink-0 shadow-inner group-hover:scale-105 transition-transform">
              SP
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-sm font-bold text-white truncate">
                  Shubhamkumar Prajapati
                </h4>
              </div>
              <div className="mt-1">
                <span className="inline-block text-[10px] font-bold text-amber-300 bg-amber-950/60 border border-amber-800/50 px-2.5 py-0.5 rounded-full">
                  Class Representative
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono mt-1.5">
                Roll No. 41 • MG26041
              </p>
              <p className="text-[11px] text-neutral-400 mt-1">
                Academic Coordination &amp; Administration
              </p>
              <div className="mt-2.5">
                <a
                  href="mailto:shubhamprajapati3601@gmail.com"
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white transition-colors"
                >
                  <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">shubhamprajapati3601@gmail.com</span>
                </a>
              </div>
            </div>
          </div>

          {/* Gayatri Naruka */}
          <div className="p-4.5 rounded-2xl bg-gradient-to-b from-neutral-900 to-neutral-950 border border-neutral-800/90 hover:border-pink-500/40 transition-all flex items-start space-x-3.5 group shadow-sm">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500/20 to-purple-500/20 border border-pink-500/30 text-pink-400 flex items-center justify-center font-black text-sm shrink-0 shadow-inner group-hover:scale-105 transition-transform">
              GN
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h4 className="text-sm font-bold text-white truncate">
                  Gayatri Naruka
                </h4>
              </div>
              <div className="mt-1">
                <span className="inline-block text-[10px] font-bold text-pink-300 bg-pink-950/60 border border-pink-800/50 px-2.5 py-0.5 rounded-full">
                  Class Representative
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono mt-1.5">
                Roll No. 13 • MG26013
              </p>
              <p className="text-[11px] text-neutral-400 mt-1">
                Student Welfare &amp; Representation
              </p>
              <div className="mt-2.5">
                <a
                  href="mailto:gayatrinaruka2004@gmail.com"
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-300 hover:text-white transition-colors"
                >
                  <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="truncate">gayatrinaruka2004@gmail.com</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECOND SECTION: Lead Developer Spotlight */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center space-x-2 px-1">
          <span className="text-indigo-400 font-bold text-sm">💻</span>
          <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
            Lead Developer &amp; System Architect
          </h3>
        </div>

        <div className="relative rounded-3xl bg-gradient-to-b from-neutral-900 via-neutral-900/95 to-neutral-950 border border-neutral-800/80 p-6 sm:p-7 shadow-[0_15px_40px_rgba(0,0,0,0.6)] overflow-hidden">
          {/* Ambient Background Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Aesthetic Profile Photo with Radiant Glowing Frame */}
            <div className="relative mb-4 group">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-md opacity-60 group-hover:opacity-100 transition duration-300 animate-pulse" />
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-white/20 shadow-2xl">
                <Image
                  src="/images/vrajkumar.jpg"
                  alt="Vrajkumar Sevak"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap bg-neutral-950/90 border border-indigo-500/40 text-[10px] font-bold text-indigo-300 px-3 py-0.5 rounded-full shadow-lg">
                Lead Developer
              </div>
            </div>

            {/* Developer Identity */}
            <h2 className="text-2xl font-black text-white tracking-tight">
              Vrajkumar Sevak
            </h2>
            <p className="text-xs font-semibold text-neutral-400 mt-0.5 font-mono">
              PID: MG26047 • Roll No. 47
            </p>
            <p className="text-xs text-neutral-300 font-medium max-w-sm mt-3 leading-relaxed">
              Architected &amp; built the MCA Attendance &amp; Academic System for the MCA Class of 2024-26.
            </p>

            {/* Featured Portfolio Button */}
            <div className="mt-4 w-full max-w-xs">
              <a
                href="https://sevakvraj-portfolio.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-[0.98] group"
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <span>View Portfolio Website</span>
                <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Social & Contact Touchpoints */}
            <div className="flex items-center gap-2 mt-4 flex-wrap justify-center max-w-sm">
              {/* GitHub */}
              <a
                href="https://github.com/sevakvraj"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700/60 text-xs font-bold text-neutral-200 hover:text-white transition-all shadow-sm group hover:scale-105"
              >
                <svg className="w-3.5 h-3.5 text-white group-hover:text-indigo-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>GitHub</span>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/sevak-vraj-79a237258/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/50 text-xs font-bold text-blue-200 hover:text-white transition-all shadow-sm group hover:scale-105"
              >
                <svg className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-300 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span>LinkedIn</span>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919427547499?text=Hi%20Vrajkumar,%20contacting%20regarding%20the%20MCA%20Attendance%20Portal"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/50 text-xs font-bold text-emerald-200 hover:text-white transition-all shadow-sm group hover:scale-105"
              >
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>WhatsApp</span>
              </a>

              {/* Call */}
              <a
                href="tel:+919427547499"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700/60 text-xs font-bold text-neutral-200 hover:text-white transition-all shadow-sm group hover:scale-105"
              >
                <svg className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>9427547499</span>
              </a>

              {/* Email */}
              <a
                href="mailto:sevakvraj2020@gmail.com"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700/80 border border-neutral-700/60 text-xs font-bold text-neutral-200 hover:text-white transition-all shadow-sm group hover:scale-105"
              >
                <svg className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>sevakvraj2020@gmail.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Clean Footer Tag */}
      <div className="text-center text-[11px] text-neutral-500 font-medium pt-2">
        <span>Handcrafted with ❤️ for MCA Class of 2024-26</span>
      </div>
    </div>
  );
}
