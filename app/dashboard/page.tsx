"use client";

import { useAuth } from "@/app/hooks/useAuth";

export default function Dashboard() {
  const { logOut, loading } = useAuth();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9F7F4]">
      <div className="text-center">
        <div className="flex h-14 w-14 mx-auto mb-4 items-center justify-center rounded-[14px] bg-[#E8610A]">
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[#1A1916] mb-2">Youre in!</h1>
        <p className="text-sm text-[#72706A] mb-6">Dashboard coming soon.</p>

        <button
          onClick={logOut}
          disabled={loading}
          className="rounded-xl border border-[#E8E4DE] bg-white px-5 py-2.5 text-sm font-medium text-[#72706A] transition-colors hover:border-[#E8610A] hover:text-[#E8610A] disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? "Signing out..." : "Sign out"}
        </button>
      </div>
    </div>
  );
}
