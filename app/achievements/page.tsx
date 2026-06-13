"use client";

import { useEffect, useState } from "react";
import { useAchievements } from "../hooks/useAchievements";
import { Achievement } from "@/app/types/achievements";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";
import AuthGuard from "../components/AuthGuard";
import {
  IconCheck,
  IconStar,
  IconSparkles,
  IconTrophy,
  categoryInfo,
  iconComponentMap,
  FallbackIcon,
} from "../components/AchievementIcons";

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--accent)] bg-gradient-to-br from-[var(--bg-accent-soft)] to-[var(--bg-card)] p-5 transition-shadow hover:shadow-md">
      <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-[var(--accent)] opacity-10" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide">
            {label}
          </p>
          <p
            className="mt-1.5 text-3xl font-bold tracking-tight text-[var(--accent)]"
            style={{ fontFamily: "'Sora', sans-serif" }}>
            {value}
          </p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-white">
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function AchievementsPage() {
  const {
    achievements,
    loading,
    error,
    getAchievementProgress,
    isAchievementUnlocked,
    totalPoints,
    unlockedCount,
    totalAchievements,
    refreshAchievements,
  } = useAchievements();

  const [recentUnlocked, setRecentUnlocked] = useState<Achievement[]>([]);

  useEffect(() => {
    if (recentUnlocked.length > 0) {
      const timer = setTimeout(() => setRecentUnlocked([]), 5000);
      return () => clearTimeout(timer);
    }
  }, [recentUnlocked]);

  const groupedAchievements = achievements.reduce(
    (groups, achievement) => {
      const category = achievement.category;
      if (!groups[category]) groups[category] = [];
      groups[category].push(achievement);
      return groups;
    },
    {} as Record<string, Achievement[]>,
  );

  return (
    <div
      className="flex h-screen overflow-hidden bg-[var(--bg-base)]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden pt-[53px] md:pt-0">
        <TopBar />

        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 md:px-8 md:py-7">
          <div className="mx-auto max-w-6xl flex flex-col gap-5 md:gap-7">
            {/* ── Loading ── */}
            {loading && (
              <div className="flex items-center justify-center py-24">
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent" />
                  <p className="mt-2 text-sm text-[var(--text-secondary)]">
                    Loading achievements...
                  </p>
                </div>
              </div>
            )}

            {/* ── Error ── */}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-sm text-red-500">{error}</p>
                <button
                  onClick={refreshAchievements}
                  className="mt-4 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--accent-hover)] transition-colors">
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && (
              <>
                {/* ── Page Header ── */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h1
                        className="text-base font-bold text-[var(--text-primary)] sm:text-lg"
                        style={{ fontFamily: "'Sora', sans-serif" }}>
                        Achievements
                      </h1>
                      <p className="text-xs text-[var(--text-muted)]">
                        Track your progress and unlock badges as you build with
                        BuildFlow
                      </p>
                    </div>
                  </div>

                  {/* Stats Row */}
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
                    <StatCard
                      label="Total Points"
                      value={totalPoints}
                      icon={
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      }
                    />
                    <StatCard
                      label="Unlocked"
                      value={`${unlockedCount} / ${totalAchievements}`}
                      icon={
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round">
                          <polyline points="8 21 12 17 16 21" />
                          <line x1="12" y1="17" x2="12" y2="11" />
                          <path d="M7 4h10l1 7a5 5 0 0 1-5 5 5 5 0 0 1-5-5L7 4z" />
                          <path d="M7 4H4l1 4a3 3 0 0 0 2 1" />
                          <path d="M17 4h3l-1 4a3 3 0 0 1-2 1" />
                        </svg>
                      }
                    />
                    <StatCard
                      label="Completion"
                      value={`${Math.round((unlockedCount / (totalAchievements || 1)) * 100)}%`}
                      icon={
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                      }
                    />
                    <StatCard
                      label="Categories"
                      value={Object.keys(groupedAchievements).length}
                      icon={
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round">
                          <rect x="3" y="3" width="7" height="7" />
                          <rect x="14" y="3" width="7" height="7" />
                          <rect x="14" y="14" width="7" height="7" />
                          <rect x="3" y="14" width="7" height="7" />
                        </svg>
                      }
                    />
                  </div>

                  {/* Overall Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-1">
                      <span>Overall Progress</span>
                      <span>
                        {Math.round(
                          (unlockedCount / (totalAchievements || 1)) * 100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--border)]">
                      <div
                        className="h-full rounded-full bg-[var(--accent)] transition-all duration-500 ease-out"
                        style={{
                          width: `${(unlockedCount / (totalAchievements || 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* ── New Unlock Notification ── */}
                {recentUnlocked.length > 0 && (
                  <div className="rounded-2xl bg-[var(--bg-accent-soft)] p-4 ring-1 ring-[var(--accent)]/20">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)] text-white shadow-md">
                        <IconSparkles className="text-lg" />
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--text-primary)]">
                          New Achievements Unlocked!
                        </p>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {recentUnlocked.map((a) => a.title).join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── Achievements by Category ── */}
                {achievements.length > 0 ?
                  <div className="flex flex-col gap-7">
                    {Object.entries(groupedAchievements).map(
                      ([category, categoryAchievements]) => {
                        const meta = categoryInfo[category];
                        const CategoryIcon = meta?.Icon ?? IconTrophy;
                        const categoryUnlocked = categoryAchievements.filter(
                          (a) => isAchievementUnlocked(a.id),
                        ).length;

                        return (
                          <div key={category}>
                            <div className="mb-4 flex items-center justify-between border-b border-[var(--border)] pb-2">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${meta?.bg ?? "bg-[var(--bg-accent-soft)]"}`}>
                                  <CategoryIcon
                                    className={`text-sm ${meta?.color ?? "text-[var(--accent)]"}`}
                                  />
                                </div>
                                <h2
                                  className="text-sm font-bold text-[var(--text-primary)]"
                                  style={{ fontFamily: "'Sora', sans-serif" }}>
                                  {meta?.name ?? category}
                                </h2>
                              </div>
                              <span className="text-xs text-[var(--text-muted)]">
                                {categoryUnlocked}/{categoryAchievements.length}
                              </span>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                              {categoryAchievements.map((achievement) => (
                                <AchievementCard
                                  key={achievement.id}
                                  achievement={achievement}
                                  progress={getAchievementProgress(
                                    achievement.id,
                                  )}
                                  isUnlocked={isAchievementUnlocked(
                                    achievement.id,
                                  )}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                : /* ── Empty State ── */
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-dashed)] bg-[var(--bg-card)] py-16 px-6 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--bg-accent-soft)]">
                      <IconTrophy className="text-2xl text-[var(--accent)]" />
                    </div>
                    <h3
                      className="mb-1 text-sm font-semibold text-[var(--text-primary)]"
                      style={{ fontFamily: "'Sora', sans-serif" }}>
                      No achievements yet
                    </h3>
                    <p className="max-w-xs text-xs leading-relaxed text-[var(--text-muted)]">
                      Start creating projects and completing tasks to earn
                      badges!
                    </p>
                  </div>
                }
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function AchievementCard({
  achievement,
  progress,
  isUnlocked,
}: {
  achievement: Achievement;
  progress: number;
  isUnlocked: boolean;
}) {
  const progressPercent = Math.min(
    (progress / achievement.requirement) * 100,
    100,
  );
  const IconComponent = iconComponentMap[achievement.icon] ?? FallbackIcon;

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl p-4 transition-all duration-200 ${
        isUnlocked ?
          "bg-gradient-to-br from-[var(--bg-card)] to-[var(--bg-accent-soft)] ring-2 ring-[var(--accent)] ring-offset-1 ring-offset-[var(--bg-base)]"
        : "bg-[var(--bg-card)] shadow-sm ring-1 ring-[var(--border)] hover:shadow-md"
      }`}>
      {/* Icon + Status */}
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all ${
            isUnlocked ?
              "shadow-lg shadow-[var(--accent)]/20"
            : "bg-[var(--bg-hover)] group-hover:bg-[var(--bg-accent-soft)]"
          }`}
          style={
            isUnlocked ?
              { backgroundColor: achievement.badgeColor || "#E8610A" }
            : {}
          }>
          <IconComponent
            className={`text-xl ${
              isUnlocked ? "text-white" : (
                "text-[var(--text-muted)] group-hover:text-[var(--accent)]"
              )
            }`}
          />
        </div>

        {isUnlocked && (
          <div className="flex items-center gap-1 rounded-full bg-[var(--accent)]/10 px-2 py-1 text-[10px] font-semibold text-[var(--accent)]">
            <IconCheck className="text-sm" />
            Unlocked
          </div>
        )}
      </div>

      {/* Title & Description */}
      <div className="mt-3">
        <h3
          className={`text-sm font-semibold ${isUnlocked ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
          {achievement.title}
        </h3>
        <p className="mt-0.5 text-xs text-[var(--text-muted)]">
          {achievement.description}
        </p>
        {isUnlocked && (
          <div className="mt-1.5 flex items-center gap-1 text-[11px] font-medium text-[var(--accent)]">
            <IconStar className="text-[10px]" />
            <span>+{achievement.points} points</span>
          </div>
        )}
      </div>

      {/* Progress Bar (locked only) */}
      {!isUnlocked && (
        <div className="mt-4">
          <div className="flex justify-between text-[11px] font-medium text-[var(--text-muted)]">
            <span>Progress</span>
            <span>
              {progress} / {achievement.requirement}
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: achievement.badgeColor || "#E8610A",
              }}
            />
          </div>
        </div>
      )}

      {/* Decorative corner */}
      {isUnlocked && (
        <div className="absolute -right-6 -top-6 h-12 w-12 rotate-45 bg-[var(--accent)]/5" />
      )}
    </div>
  );
}
