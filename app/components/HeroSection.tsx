"use client";

import { useAuth } from "@/app/hooks/useAuth";
import { type Project } from "@/app/hooks/useProject";
import { useEffect, useState } from "react";

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

interface HeroSectionProps {
  projects?: Project[];
}

export default function HeroSection({ projects = [] }: HeroSectionProps) {
  const { user } = useAuth();
  const [animatedProgress, setAnimatedProgress] = useState(0);

  const rawName = user?.displayName || user?.email?.split("@")[0] || "there";
  const displayName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
  const email = user?.email ?? "";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dueTodayCount = projects.filter((p) => {
    if (!p.endDate || p.progress >= 100) return false;
    const end = new Date(p.endDate);
    end.setHours(0, 0, 0, 0);
    return end.getTime() === today.getTime();
  }).length;

  const needsAttentionCount = projects.filter((p) => {
    if (p.progress >= 100) return false;
    const isOverdue =
      p.endDate && new Date(p.endDate).setHours(0, 0, 0, 0) < today.getTime();
    const isHighPriority = p.priority === "High";
    return isOverdue || isHighPriority;
  }).length;

  // Calculate overall progress - sum of all project progresses divided by number of projects
  const overallProgress =
    projects.length === 0 ?
      0
    : Math.round(
        projects.reduce((sum, p) => {
          const progressValue = p.progress ?? 0;
          return sum + progressValue;
        }, 0) / projects.length,
      );

  // Animate the progress on mount and when it changes
  useEffect(() => {
    const duration = 800;
    const steps = 60;
    const increment = overallProgress / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setAnimatedProgress(overallProgress);
        clearInterval(timer);
      } else {
        setAnimatedProgress(Math.min(currentStep * increment, overallProgress));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [overallProgress]);

  const circumference = 2 * Math.PI * 32;
  const strokeDashoffset =
    circumference - (circumference * animatedProgress) / 100;

  const summaryText = (): string => {
    if (projects.length === 0)
      return "No projects yet. Add one to get started!";

    const parts: string[] = [];
    if (dueTodayCount > 0)
      parts.push(
        `You have <strong>${dueTodayCount} project${dueTodayCount !== 1 ? "s" : ""}</strong> due today`,
      );
    if (needsAttentionCount > 0)
      parts.push(
        `<strong>${needsAttentionCount} project${needsAttentionCount !== 1 ? "s" : ""}</strong> need${needsAttentionCount === 1 ? "s" : ""} your attention`,
      );

    if (parts.length === 0 && projects.length > 0)
      return `All <strong>${projects.length} project${projects.length !== 1 ? "s" : ""}</strong> are on track. Great work!`;

    if (parts.length === 0) return "No projects yet. Add one to get started!";

    return parts.join(" and ") + ".";
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#E8610A] to-[#D15508] px-5 py-6 sm:px-8 sm:py-8 shadow-lg">
      {/* Animated background pattern */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 900 200"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true">
        <circle cx="820" cy="-40" r="200" fill="rgba(255,255,255,0.06)" />
        <circle cx="700" cy="220" r="180" fill="rgba(255,255,255,0.04)" />
        <circle cx="100" cy="100" r="250" fill="rgba(255,255,255,0.03)" />
        <circle cx="450" cy="100" r="150" fill="rgba(255,255,255,0.02)" />
        <line
          x1="0"
          y1="200"
          x2="900"
          y2="0"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth="1.5"
        />
        <line
          x1="0"
          y1="100"
          x2="900"
          y2="100"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="1"
        />
      </svg>

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {/* Mascot - removed bounce animation */}
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
            <p
              className="mt-2 text-xs text-white/70 sm:text-sm"
              dangerouslySetInnerHTML={{ __html: summaryText() }}
            />
          </div>
        </div>

        {/* Progress Circle */}
        <div className="hidden md:flex flex-col items-center gap-1 shrink-0 group">
          <div className="relative flex h-20 w-20 items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
              {/* Background track */}
              <circle
                cx="40"
                cy="40"
                r="32"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="7"
              />
              {/* Progress arc */}
              <circle
                cx="40"
                cy="40"
                r="32"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{
                  transition:
                    "stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />
              <defs>
                <linearGradient
                  id="progressGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%">
                  <stop offset="0%" stopColor="#FFD700" />
                  <stop offset="50%" stopColor="#FFA500" />
                  <stop offset="100%" stopColor="#FF6347" />
                </linearGradient>
              </defs>
            </svg>
            <span className="absolute text-lg font-bold text-white">
              {Math.round(animatedProgress)}%
            </span>
          </div>
          <p className="text-xs font-medium text-white/70">Overall Progress</p>
          <p className="text-[10px] text-white/40">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Progress Bar for Mobile */}
      <div className="mt-4 md:hidden">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium text-white/70">
            Overall Progress
          </span>
          <span className="text-xs font-bold text-white">
            {Math.round(overallProgress)}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
          <div
            className="h-full rounded-full bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 transition-all duration-500"
            style={{ width: `${overallProgress}%` }}
          />
        </div>
        <p className="mt-1 text-[10px] text-white/40 text-center">
          {projects.length} project{projects.length !== 1 ? "s" : ""} total
        </p>
      </div>
    </div>
  );
}
