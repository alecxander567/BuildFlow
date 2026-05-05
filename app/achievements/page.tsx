"use client";

import { useEffect, useState } from "react";
import { useAchievements } from "../hooks/useAchievements";
import { Achievement } from "@/app/types/achievements";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";

export default function AchievementsPage() {
  const {
    achievements,
    userStats,
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

  const categoryInfo: Record<string, { name: string; icon: string }> = {
    projects: { name: "Projects", icon: "📁" },
    tasks: { name: "Tasks", icon: "✓" },
    streak: { name: "Activity Streak", icon: "🔥" },
    social: { name: "Collaboration", icon: "👥" },
    tools: { name: "Tools", icon: "🔧" },
  };

  const iconMap: Record<string, string> = {
    ProjectIcon: "📁",
    TaskIcon: "✓",
    StreakIcon: "🔥",
    SocialIcon: "👥",
    ToolIcon: "🔧",
  };

  return (
    <div
      className="flex h-screen overflow-hidden bg-[#F9F7F4]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden pt-[53px] md:pt-0">
        <TopBar />

        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 md:px-8 md:py-7">
          <div className="mx-auto max-w-6xl flex flex-col gap-5 md:gap-7">
            {/* ── Loading State ── */}
            {loading && (
              <div className="flex items-center justify-center py-24">
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#E8610A] border-t-transparent" />
                  <p className="mt-2 text-sm text-[#72706A]">
                    Loading achievements...
                  </p>
                </div>
              </div>
            )}

            {/* ── Error State ── */}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-sm text-red-500">{error}</p>
                <button
                  onClick={refreshAchievements}
                  className="mt-4 rounded-xl bg-[#E8610A] px-4 py-2 text-sm font-semibold text-white hover:bg-[#D15508] transition-colors">
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
                        className="text-base font-bold text-[#1A1916] sm:text-lg"
                        style={{ fontFamily: "'Sora', sans-serif" }}>
                        Achievements
                      </h1>
                      <p className="text-xs text-[#B0ADA7]">
                        Track your progress and unlock badges as you build with
                        BuildFlow
                      </p>
                    </div>

                    <div className="flex gap-3">
                      {/* Points Card */}
                      <div className="rounded-2xl bg-gradient-to-br from-[#E8610A] to-[#F59E0B] px-4 py-2 text-center shadow-sm">
                        <div className="text-2xl font-bold text-white">
                          {totalPoints}
                        </div>
                        <div className="text-[10px] font-medium uppercase tracking-wider text-white/80">
                          Total Points
                        </div>
                      </div>
                      {/* Unlocked Card */}
                      <div className="rounded-2xl bg-white px-4 py-2 text-center shadow-sm ring-1 ring-[#EDE8E2]">
                        <div className="text-2xl font-bold text-[#E8610A]">
                          {unlockedCount}
                        </div>
                        <div className="text-[10px] font-medium uppercase tracking-wider text-[#B0ADA7]">
                          / {totalAchievements} Unlocked
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Overall Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-[#72706A] mb-1">
                      <span>Overall Progress</span>
                      <span>
                        {Math.round(
                          (unlockedCount / (totalAchievements || 1)) * 100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#EDE8E2]">
                      <div
                        className="h-full rounded-full bg-[#E8610A] transition-all duration-500 ease-out"
                        style={{
                          width: `${(unlockedCount / (totalAchievements || 1)) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* ── New Unlock Notification ── */}
                {recentUnlocked.length > 0 && (
                  <div className="rounded-2xl bg-gradient-to-r from-[#E8610A]/10 to-[#F59E0B]/10 p-4 ring-1 ring-[#E8610A]/20">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🎉</span>
                      <div>
                        <p className="font-semibold text-[#1A1916]">
                          New Achievements Unlocked!
                        </p>
                        <p className="text-xs text-[#72706A]">
                          {recentUnlocked.map((a) => a.title).join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── User Stats ── */}
                {userStats && (
                  <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-[#EDE8E2]">
                    <h3
                      className="mb-3 text-sm font-bold text-[#1A1916]"
                      style={{ fontFamily: "'Sora', sans-serif" }}>
                      Your Stats
                    </h3>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      <StatBadge
                        label="Projects"
                        value={userStats.projectsCreated}
                      />
                      <StatBadge
                        label="Tasks Completed"
                        value={userStats.tasksCompleted}
                      />
                      <StatBadge
                        label="Days Active"
                        value={userStats.daysActive}
                      />
                      <StatBadge
                        label="Team Members"
                        value={userStats.teamMembersAdded}
                      />
                    </div>
                  </div>
                )}

                {/* ── Achievements by Category ── */}
                {achievements.length > 0 ?
                  <div className="flex flex-col gap-7">
                    {Object.entries(groupedAchievements).map(
                      ([category, categoryAchievements]) => {
                        const categoryUnlocked = categoryAchievements.filter(
                          (a) => isAchievementUnlocked(a.id),
                        ).length;

                        return (
                          <div key={category}>
                            <div className="mb-4 flex items-center justify-between border-b border-[#EDE8E2] pb-2">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">
                                  {categoryInfo[category]?.icon || "🏆"}
                                </span>
                                <h2
                                  className="text-sm font-bold text-[#1A1916]"
                                  style={{ fontFamily: "'Sora', sans-serif" }}>
                                  {categoryInfo[category]?.name || category}
                                </h2>
                              </div>
                              <span className="text-xs text-[#B0ADA7]">
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
                                  iconMap={iconMap}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      },
                    )}
                  </div>
                : /* ── Empty State ── */
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#D6D1CA] bg-white py-16 px-6 text-center">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FEF0E7]">
                      <span className="text-3xl">🏆</span>
                    </div>
                    <h3
                      className="mb-1 text-sm font-semibold text-[#1A1916]"
                      style={{ fontFamily: "'Sora', sans-serif" }}>
                      No achievements yet
                    </h3>
                    <p className="max-w-xs text-xs leading-relaxed text-[#B0ADA7]">
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

function StatBadge({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-[#F9F7F4] p-2 text-center">
      <div className="text-xl font-bold text-[#E8610A]">{value}</div>
      <div className="text-[10px] font-medium text-[#B0ADA7]">{label}</div>
    </div>
  );
}

function AchievementCard({
  achievement,
  progress,
  isUnlocked,
  iconMap,
}: {
  achievement: Achievement;
  progress: number;
  isUnlocked: boolean;
  iconMap: Record<string, string>;
}) {
  const progressPercent = Math.min(
    (progress / achievement.requirement) * 100,
    100,
  );

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl p-4 transition-all duration-200 ${
        isUnlocked ?
          "bg-gradient-to-br from-white to-[#FEF0E7] ring-2 ring-[#E8610A] ring-offset-1"
        : "bg-white shadow-sm ring-1 ring-[#EDE8E2] hover:shadow-md"
      }`}>
      {/* Icon + Status */}
      <div className="flex items-start justify-between">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all ${
            isUnlocked ?
              "shadow-lg shadow-[#E8610A]/20 text-white"
            : "bg-[#F5F4F1] text-[#B0ADA7] group-hover:bg-[#FEF0E7]"
          }`}
          style={
            isUnlocked ?
              { backgroundColor: achievement.badgeColor || "#E8610A" }
            : {}
          }>
          <span className="text-xl">{iconMap[achievement.icon] ?? "🏆"}</span>
        </div>

        {isUnlocked && (
          <div className="flex items-center gap-1 rounded-full bg-[#E8610A]/10 px-2 py-1 text-[10px] font-semibold text-[#E8610A]">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Unlocked
          </div>
        )}
      </div>

      {/* Title & Description */}
      <div className="mt-3">
        <h3
          className={`text-sm font-semibold ${isUnlocked ? "text-[#1A1916]" : "text-[#72706A]"}`}>
          {achievement.title}
        </h3>
        <p className="mt-0.5 text-xs text-[#B0ADA7]">
          {achievement.description}
        </p>
        {isUnlocked && (
          <p className="mt-1 text-[11px] font-medium text-[#E8610A]">
            +{achievement.points} points
          </p>
        )}
      </div>

      {/* Progress Bar (locked only) */}
      {!isUnlocked && (
        <div className="mt-4">
          <div className="flex justify-between text-[11px] font-medium text-[#B0ADA7]">
            <span>Progress</span>
            <span>
              {progress} / {achievement.requirement}
            </span>
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#EDE8E2]">
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
        <div className="absolute -right-6 -top-6 h-12 w-12 rotate-45 bg-[#E8610A]/5" />
      )}
    </div>
  );
}
