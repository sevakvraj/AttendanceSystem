import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md flex flex-col items-center">
        {/* App Logo / Icon */}
        <div className="w-24 h-24 bg-neutral-900 border border-neutral-800 rounded-3xl mb-8 flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.05)]">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>

        <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">MCA Attendance</h1>
        <p className="text-neutral-400 text-center mb-10 font-medium">Class Representative System</p>

        <Link 
          href="/login"
          className="w-full bg-white text-black font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-[1.02] transition-transform text-center flex items-center justify-center space-x-2"
        >
          <span>Login to Portal</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
        </Link>
      </div>
    </div>
  );
}
