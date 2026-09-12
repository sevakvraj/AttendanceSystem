"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getStudentByPid } from "@/services/db";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (username.toLowerCase() === "admin001" || username.toLowerCase().startsWith("mg")) {
        const user: any = await getStudentByPid(username);
        
        if (user && user.password === password) {
          if (username.toLowerCase() === "admin001") {
            router.push("/admin");
          } else {
            // Store PID in localStorage so the student dashboard knows who is logged in
            localStorage.setItem("studentPid", user.pid);
            localStorage.setItem("studentName", user.name);
            router.push("/student");
          }
        } else {
          setError("Invalid ID or password.");
        }
      } else {
        setError("Invalid credentials. Please use your MG... ID or admin001");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to database.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center">
      <div className="w-full max-w-md min-h-screen flex flex-col relative pb-6 p-6">
        
        <div className="mt-12 mb-10">
          <Link href="/" className="text-neutral-400 hover:text-white transition-colors mb-6 inline-flex items-center space-x-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            <span className="font-medium text-sm">Back</span>
          </Link>
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">Welcome Back</h1>
          <p className="text-neutral-500 font-medium">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 flex-1">
          {error && (
            <div className="bg-red-950/50 border border-red-900/50 text-red-500 p-4 rounded-2xl text-sm font-medium">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 ml-1">Username / PID</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 focus:border-white focus:ring-1 focus:ring-white rounded-2xl px-5 py-4 text-white placeholder-neutral-600 outline-none transition-all font-medium"
                placeholder="e.g. 26MCA1001"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2 ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 focus:border-white focus:ring-1 focus:ring-white rounded-2xl px-5 py-4 text-white placeholder-neutral-600 outline-none transition-all font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-[1.02] transition-transform flex justify-center items-center mt-8 disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
