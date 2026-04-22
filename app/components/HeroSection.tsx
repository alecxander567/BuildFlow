"use client";

import { useAuth } from "@/app/hooks/useAuth";

function getDynamicDate() {
  const now = new Date();
  const dayName = now.toLocaleDateString("en-US", { weekday: "long" });
  const month = now.toLocaleDateString("en-US", { month: "long" });
  const day = now.getDate();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const weekNumber = Math.ceil(
    ((now.getTime() - startOfYear.getTime()) / 86400000 +
      startOfYear.getDay() +
      1) /
      7,
  );
  return `${dayName}, ${month} ${day} · Week ${weekNumber}`;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function getGreetingEmoji() {
  const hour = new Date().getHours();
  if (hour < 12) return "☀️";
  if (hour < 17) return "👋";
  return "🌙";
}

export default function HeroSection() {
  const { user } = useAuth();

  const rawName = user?.displayName || user?.email?.split("@")[0] || "there";
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const email = user?.email ?? "";

  return (
    <div className="relative overflow-hidden rounded-2xl bg-[#E8610A] px-5 py-6 sm:px-8 sm:py-8">
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 900 200"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true">
        <circle cx="820" cy="-40" r="200" fill="rgba(255,255,255,0.06)" />
        <circle cx="700" cy="220" r="180" fill="rgba(0,0,0,0.06)" />
        <circle cx="100" cy="100" r="250" fill="rgba(255,255,255,0.03)" />
        <line
          x1="0"
          y1="200"
          x2="900"
          y2="0"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1.5"
        />
      </svg>

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-2 ring-white/20 overflow-hidden sm:h-[88px] sm:w-[88px]">
            <img
              src="/botlight.svg"
              alt="BuildFlow mascot"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <p className="mb-0.5 text-xs font-medium text-white/60 sm:text-sm">
              {getDynamicDate()}
            </p>
            <h1
              className="text-xl font-extrabold tracking-tight text-white sm:text-3xl"
              style={{ fontFamily: "'Sora', sans-serif" }}>
              {getGreeting()}, {displayName} {getGreetingEmoji()}
            </h1>
            {email && (
              <p className="mt-0.5 text-[11px] font-medium text-white/50 tracking-wide truncate">
                {email}
              </p>
            )}
            <p className="mt-1 text-xs text-white/70 sm:text-sm">
              You have <span className="font-semibold text-white">5 tasks</span>{" "}
              due today and{" "}
              <span className="font-semibold text-white">2 projects</span> need
              your attention.
            </p>
          </div>
        </div>

        <div className="hidden md:flex flex-col items-center gap-1 shrink-0">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="32"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="7"
              />
              <circle
                cx="40"
                cy="40"
                r="32"
                fill="none"
                stroke="white"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray="201"
                strokeDashoffset="60"
              />
            </svg>
            <span className="absolute text-lg font-bold text-white">70%</span>
          </div>
          <p className="text-xs font-medium text-white/70">Overall Progress</p>
        </div>
      </div>
    </div>
  );
}
