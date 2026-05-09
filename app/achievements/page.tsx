"use client";

import { useEffect, useState } from "react";
import { useAchievements } from "../hooks/useAchievements";
import { Achievement } from "@/app/types/achievements";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";

const IconFolder = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
  </svg>
);

const IconCheck = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const IconFire = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
  </svg>
);

const IconUsers = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconWrench = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </svg>
);

const IconTrophy = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round">
    <polyline points="8 21 12 17 16 21" />
    <line x1="12" y1="17" x2="12" y2="11" />
    <path d="M7 4h10l1 7a5 5 0 0 1-5 5 5 5 0 0 1-5-5L7 4z" />
    <path d="M7 4H4l1 4a3 3 0 0 0 2 1" />
    <path d="M17 4h3l-1 4a3 3 0 0 1-2 1" />
  </svg>
);

const IconStar = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const IconRocket = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const IconLightning = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const IconChart = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const IconCalendar = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <polyline points="9 16 11 18 15 14" />
  </svg>
);

const IconSparkles = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M12 3v1m0 16v1M4.22 4.22l.7.7m12.16 12.16.7.7M3 12h1m16 0h1M4.22 19.78l.7-.7M18.36 5.64l.7-.7" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

const IconWorkspaces = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);

const IconLeaderboard = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M8 6h.01M8 10h.01M8 14h.01M8 18h.01" />
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <line x1="12" y1="8" x2="17" y2="8" />
    <line x1="12" y1="12" x2="17" y2="12" />
    <line x1="12" y1="16" x2="17" y2="16" />
  </svg>
);

// Semantic color categories
const categoryInfo: Record<
  string,
  { name: string; Icon: React.ElementType; color: string; bg: string }
> = {
  projects: {
    name: "Projects",
    Icon: IconFolder,
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/40",
  },
  tasks: {
    name: "Tasks",
    Icon: IconCheck,
    color: "text-green-500",
    bg: "bg-green-50 dark:bg-green-950/40",
  },
  streak: {
    name: "Activity Streak",
    Icon: IconFire,
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950/40",
  },
  social: {
    name: "Collaboration",
    Icon: IconUsers,
    color: "text-purple-500",
    bg: "bg-purple-50 dark:bg-purple-950/40",
  },
  tools: {
    name: "Tools",
    Icon: IconWrench,
    color: "text-[var(--accent)]",
    bg: "bg-[var(--bg-accent-soft)]",
  },
};

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

const iconComponentMap: Record<string, React.ElementType> = {
  ProjectIcon: IconFolder,
  TaskIcon: IconCheck,
  StreakIcon: IconFire,
  SocialIcon: IconUsers,
  ToolIcon: IconWrench,
  RocketIcon: IconRocket,
  StarIcon: IconStar,
  LightningIcon: IconLightning,
  ChartIcon: IconChart,
  CalendarIcon: IconCalendar,
  SparklesIcon: IconSparkles,
  WorkspacesIcon: IconWorkspaces,
  LeaderboardIcon: IconLeaderboard,
};

const FallbackIcon = IconTrophy;

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
