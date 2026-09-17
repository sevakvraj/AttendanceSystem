"use client";

import Link from "next/link";
import LoginAvatar from "@/components/login/LoginAvatar";
import { useLoginAuth } from "@/hooks/useLoginAuth";

export default function LoginPage() {
  const {
    pid,
    setPid,
    password,
    setPassword,
    showPassword,
    toggleShowPassword,
    isPasswordFocused,
    setIsPasswordFocused,
    isPidFocused,
    setIsPidFocused,
    error,
    isLoading,
    handleLogin,
  } = useLoginAuth();

  return (
    <div className="min-h-screen bg-black relative flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden select-none">
      {/* Ambient Pulsing Gradient Background Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[600px] h-[600px] bg-gradient-to-br from-indigo-600/20 via-purple-600/15 to-transparent rounded-full blur-3xl opacity-70 animate-pulse" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-gradient-to-tl from-pink-600/20 via-purple-600/15 to-transparent rounded-full blur-3xl opacity-70" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-950/25 rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* Main Glassmorphic Container Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="bg-neutral-900/70 backdrop-blur-2xl border border-neutral-800/90 rounded-3xl p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] relative overflow-hidden">
          
          {/* Top Radiant Gradient Accent Bar */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]" />

          {/* Top Bar: Back Button & Class Badge */}
          <div className="flex items-center justify-between mb-4">
            <Link
              href="/"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-neutral-800/60 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700/60 transition-all text-xs font-medium group"
            >
              <svg
                className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </Link>

            <span className="text-[11px] font-semibold text-purple-300 bg-purple-950/50 px-3 py-1 rounded-full border border-purple-800/40 flex items-center space-x-1.5">
              <svg className="w-3.5 h-3.5 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
              </svg>
              <span>MCA Class of 26-27</span>
            </span>
          </div>

          {/* Interactive Animated Character Avatar */}
          <div className="mb-3">
            <LoginAvatar
              isPasswordFocused={isPasswordFocused}
              showPassword={showPassword}
              usernameLength={pid.length}
              isPidFocused={isPidFocused}
              hasPassword={password.length > 0}
            />
          </div>

          {/* Title and Subtitle */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-100 to-neutral-300 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-xs text-neutral-400 font-medium mt-1.5 leading-relaxed max-w-xs mx-auto">
              Enter your credentials to access your{" "}
              <span className="text-neutral-200 font-semibold">Attendance</span>{" "}
              &amp;{" "}
              <span className="text-neutral-200 font-semibold">Study Materials</span>
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-950/40 border border-red-800/60 text-red-400 p-3.5 rounded-2xl text-xs font-medium flex items-start space-x-2 animate-shake">
                <svg className="w-4 h-4 shrink-0 mt-0.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Student PID Input (Username and ADMIN001 removed from display) */}
            <div>
              <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5 ml-1">
                Student PID
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={pid}
                  onChange={(e) => setPid(e.target.value.toUpperCase())}
                  onFocus={() => setIsPidFocused(true)}
                  onBlur={() => setIsPidFocused(false)}
                  className="w-full bg-neutral-950/80 border border-neutral-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-neutral-600 placeholder:normal-case placeholder:font-sans outline-none transition-all font-medium uppercase font-mono tracking-wider"
                  placeholder="e.g. MG26001"
                  autoCapitalize="characters"
                  autoComplete="username"
                  required
                />
              </div>
              <p className="text-[10px] text-neutral-500 mt-1 ml-1.5">
                Format: <span className="text-neutral-400 font-mono">MG26001</span> to <span className="text-neutral-400 font-mono">MG26049</span>
              </p>
            </div>

            {/* Password Input with Eye Icon Toggle */}
            <div>
              <div className="flex items-center justify-between mb-1.5 ml-1">
                <label className="block text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  Password
                </label>
                <span className="text-[10px] text-neutral-500">
                  Default is your Student PID
                </span>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  className="w-full bg-neutral-950/80 border border-neutral-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-2xl pl-12 pr-12 py-3.5 text-sm text-white placeholder-neutral-600 outline-none transition-all font-medium tracking-wide"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                {/* Aesthetic Eye Icon Toggle Button */}
                <button
                  type="button"
                  onMouseDown={(e) => {
                    // Prevent button click from causing input to blur
                    e.preventDefault();
                  }}
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800/60 transition-colors cursor-pointer z-10"
                  title={showPassword ? "Hide password" : "Show password"}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    // Eye Off (Crossed eye)
                    <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    // Eye Open
                    <svg className="w-5 h-5 text-neutral-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Glowing Gradient Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 text-white font-bold py-3.5 px-6 rounded-2xl shadow-[0_0_25px_rgba(147,51,234,0.35)] hover:shadow-[0_0_35px_rgba(147,51,234,0.55)] transition-all transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer text-sm"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Footer with MCA Class of 26-27 */}
          <div className="mt-6 pt-4 border-t border-neutral-800/80 flex items-center justify-center text-[11px] text-neutral-400 font-medium">
            <span>MCA Class of 26-27</span>
          </div>

        </div>
      </div>
    </div>
  );
}
