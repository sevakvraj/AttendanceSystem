"use client";

import React from "react";

interface LoginAvatarProps {
  isPasswordFocused: boolean;
  showPassword: boolean;
  usernameLength: number;
  isPidFocused: boolean;
  hasPassword?: boolean;
}

export default function LoginAvatar({
  isPasswordFocused,
  showPassword,
  usernameLength,
  isPidFocused,
  hasPassword = false,
}: LoginAvatarProps) {
  // Password is active if field is focused OR user has typed password content
  const isPasswordActive = isPasswordFocused || (hasPassword && !isPidFocused);
  const isCoveringBoth = isPasswordActive && !showPassword;
  const isPeeking = isPasswordActive && showPassword;

  // Calculate pupil tracking when typing student PID or peeking down at password
  const pupilX = isPeeking
    ? 2
    : isPidFocused
    ? Math.min(Math.max((usernameLength - 4) * 0.7, -4.5), 4.5)
    : 0;
  const pupilY = isPeeking ? 4 : isPidFocused ? 4 : 0;

  return (
    <div className="relative w-36 h-36 mx-auto flex items-center justify-center select-none">
      {/* Ambient glowing aura behind character */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/25 via-purple-500/30 to-pink-500/25 rounded-full blur-xl scale-110 pointer-events-none" />

      {/* Avatar circular frame */}
      <div className="relative w-32 h-32 rounded-full p-1 bg-gradient-to-b from-indigo-500/40 via-purple-500/30 to-neutral-950/80 border border-indigo-500/40 shadow-2xl backdrop-blur-md overflow-hidden">
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full transform transition-transform duration-300"
          style={{
            transform: isPasswordFocused
              ? "scale(0.97) translateY(2px)"
              : isPidFocused
              ? "scale(1.02) translateY(3px) rotate(1deg)"
              : "scale(1)",
          }}
        >
          <defs>
            <linearGradient id="faceGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff1e6" />
              <stop offset="100%" stopColor="#fed7aa" />
            </linearGradient>
            <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="50%" stopColor="#312e81" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </linearGradient>
            <linearGradient id="handGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff5eb" />
              <stop offset="100%" stopColor="#fdba74" />
            </linearGradient>
            <filter id="handShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Ears */}
          <circle cx="32" cy="85" r="9" fill="#fbcfe8" />
          <circle cx="32" cy="85" r="5" fill="#f472b6" opacity="0.4" />
          <circle cx="128" cy="85" r="9" fill="#fbcfe8" />
          <circle cx="128" cy="85" r="5" fill="#f472b6" opacity="0.4" />

          {/* Head / Face Base */}
          <rect
            x="36"
            y="42"
            width="88"
            height="86"
            rx="43"
            fill="url(#faceGrad)"
          />

          {/* Blushing Cheeks */}
          <ellipse
            cx="49"
            cy="96"
            rx="8"
            ry="4.5"
            fill="#fb7185"
            opacity={isPasswordFocused ? 0.65 : 0.4}
            className="transition-opacity duration-300"
          />
          <ellipse
            cx="111"
            cy="96"
            rx="8"
            ry="4.5"
            fill="#fb7185"
            opacity={isPasswordFocused ? 0.65 : 0.4}
            className="transition-opacity duration-300"
          />

          {/* Nose */}
          <path
            d="M 78 88 Q 80 91 82 88"
            stroke="#ea580c"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
          />

          {/* Mouth */}
          {isCoveringBoth ? (
            // Cute shy smile
            <path
              d="M 73 107 Q 80 113 87 107"
              stroke="#9a3412"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
          ) : isPeeking ? (
            // Cheeky grin
            <path
              d="M 72 106 Q 81 114 89 105"
              stroke="#9a3412"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
          ) : (
            // Relaxed friendly smile
            <path
              d="M 70 106 Q 80 113 90 106"
              stroke="#9a3412"
              strokeWidth="2.8"
              strokeLinecap="round"
              fill="none"
            />
          )}

          {/* Eyebrows */}
          <path
            d={
              isCoveringBoth
                ? "M 46 64 Q 56 61 65 64"
                : isPeeking
                ? "M 45 61 Q 55 55 65 62"
                : "M 46 63 Q 56 58 66 63"
            }
            stroke="#312e81"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-300"
          />
          <path
            d={
              isCoveringBoth
                ? "M 95 64 Q 104 61 114 64"
                : isPeeking
                ? "M 95 64 Q 104 62 114 65"
                : "M 94 63 Q 104 58 114 63"
            }
            stroke="#312e81"
            strokeWidth="3.2"
            strokeLinecap="round"
            fill="none"
            className="transition-all duration-300"
          />

          {/* LEFT EYE */}
          {isCoveringBoth ? (
            // Closed Left Eye (Gentle happy curve)
            <g>
              <path
                d="M 46 80 Q 56 89 66 80"
                stroke="#1e1b4b"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <path d="M 52 87 L 50 90" stroke="#1e1b4b" strokeWidth="2" strokeLinecap="round" />
              <path d="M 60 87 L 62 90" stroke="#1e1b4b" strokeWidth="2" strokeLinecap="round" />
            </g>
          ) : (
            // Open Left Eye
            <g className="transition-all duration-200">
              <ellipse cx="56" cy="80" rx="10" ry="11" fill="#ffffff" />
              <ellipse
                cx={56 + pupilX}
                cy={80 + pupilY}
                rx="5.5"
                ry="6"
                fill="#1e1b4b"
                className="transition-all duration-150"
              />
              <circle
                cx={54 + pupilX}
                cy={77 + pupilY}
                r="2"
                fill="#ffffff"
                className="transition-all duration-150"
              />
              <circle
                cx={58 + pupilX}
                cy={82 + pupilY}
                r="1"
                fill="#ffffff"
                opacity="0.8"
                className="transition-all duration-150"
              />
            </g>
          )}

          {/* RIGHT EYE */}
          {isPasswordActive ? (
            // Closed Right Eye
            <g>
              <path
                d="M 94 80 Q 104 89 114 80"
                stroke="#1e1b4b"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
              />
              <path d="M 100 87 L 98 90" stroke="#1e1b4b" strokeWidth="2" strokeLinecap="round" />
              <path d="M 108 87 L 110 90" stroke="#1e1b4b" strokeWidth="2" strokeLinecap="round" />
            </g>
          ) : (
            // Open Right Eye
            <g className="transition-all duration-200">
              <ellipse cx="104" cy="80" rx="10" ry="11" fill="#ffffff" />
              <ellipse
                cx={104 + pupilX}
                cy={80 + pupilY}
                rx="5.5"
                ry="6"
                fill="#1e1b4b"
                className="transition-all duration-150"
              />
              <circle
                cx={102 + pupilX}
                cy={77 + pupilY}
                r="2"
                fill="#ffffff"
                className="transition-all duration-150"
              />
              <circle
                cx={106 + pupilX}
                cy={82 + pupilY}
                r="1"
                fill="#ffffff"
                opacity="0.8"
                className="transition-all duration-150"
              />
            </g>
          )}

          {/* Hair Front Fringe */}
          <path
            d="M 36 62 C 34 26, 126 26, 124 62 C 114 44, 98 38, 80 40 C 60 38, 44 44, 36 62 Z"
            fill="url(#hairGrad)"
          />
          <path
            d="M 64 36 Q 72 44 86 42 Q 78 36 64 36 Z"
            fill="#4338ca"
            opacity="0.6"
          />

          {/* ANIMATED HANDS (Smooth Covering of Eyes) */}
          {/* Left Hand */}
          <g
            filter="url(#handShadow)"
            className="transition-all duration-300 ease-out"
            style={{
              transform: isCoveringBoth
                ? "translate(40px, 70px) rotate(-6deg)"
                : isPeeking
                ? "translate(34px, 102px) rotate(-22deg)"
                : "translate(40px, 145px) scale(0.6)",
              opacity: isPasswordActive ? 1 : 0,
              transformOrigin: "56px 80px",
            }}
          >
            <path
              d="M 0 0 C 0 -16, 32 -16, 32 0 C 32 18, 24 26, 16 26 C 8 26, 0 18, 0 0 Z"
              fill="url(#handGrad)"
              stroke="#ea580c"
              strokeWidth="1.6"
            />
            <line x1="11" y1="-10" x2="11" y2="4" stroke="#ea580c" strokeWidth="1.4" strokeLinecap="round" opacity="0.65" />
            <line x1="21" y1="-10" x2="21" y2="4" stroke="#ea580c" strokeWidth="1.4" strokeLinecap="round" opacity="0.65" />
          </g>

          {/* Right Hand */}
          <g
            filter="url(#handShadow)"
            className="transition-all duration-300 ease-out"
            style={{
              transform: isPasswordActive
                ? "translate(88px, 70px) rotate(6deg)"
                : "translate(88px, 145px) scale(0.6)",
              opacity: isPasswordActive ? 1 : 0,
              transformOrigin: "104px 80px",
            }}
          >
            <path
              d="M 0 0 C 0 -16, 32 -16, 32 0 C 32 18, 24 26, 16 26 C 8 26, 0 18, 0 0 Z"
              fill="url(#handGrad)"
              stroke="#ea580c"
              strokeWidth="1.6"
            />
            <line x1="11" y1="-10" x2="11" y2="4" stroke="#ea580c" strokeWidth="1.4" strokeLinecap="round" opacity="0.65" />
            <line x1="21" y1="-10" x2="21" y2="4" stroke="#ea580c" strokeWidth="1.4" strokeLinecap="round" opacity="0.65" />
          </g>
        </svg>
      </div>

      {/* Floating Status Badge with Aesthetic Micro-Icon Indicator */}
      {isCoveringBoth && (
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-3.5 py-1 rounded-full bg-neutral-900/95 border border-purple-500/40 text-[11px] font-medium text-purple-300 shadow-xl shadow-purple-500/20 flex items-center space-x-1.5 backdrop-blur-md transition-all z-20">
          <svg className="w-3.5 h-3.5 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
          </svg>
          <span>Eyes Shielded</span>
        </div>
      )}
      {isPeeking && (
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-3.5 py-1 rounded-full bg-neutral-900/95 border border-pink-500/40 text-[11px] font-medium text-pink-300 shadow-xl shadow-pink-500/20 flex items-center space-x-1.5 backdrop-blur-md transition-all z-20">
          <svg className="w-3.5 h-3.5 text-pink-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>Peeking Enabled</span>
        </div>
      )}
      {!isPasswordFocused && isPidFocused && (
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap px-3.5 py-1 rounded-full bg-neutral-900/95 border border-indigo-500/40 text-[11px] font-medium text-indigo-300 shadow-xl shadow-indigo-500/20 flex items-center space-x-1.5 backdrop-blur-md transition-all z-20">
          <svg className="w-3.5 h-3.5 text-indigo-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span>Entering Student PID</span>
        </div>
      )}
    </div>
  );
}
