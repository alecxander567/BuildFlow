import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "./useAuth";
import {
  initializeUserStats,
  getUserStats,
  getUserAchievements,
  updateStatsAndCheckAchievements,
  checkAndUnlockAchievements,
} from "@/app/lib/firebase/achievementService";
import {
  Achievement,
  UserStats,
  UserAchievement,
} from "@/app/types/achievements";
import {
  ACHIEVEMENTS,
  getAchievementById,
} from "@/app/lib/achievements/achievementsConfig";

interface UseAchievementsReturn {
  achievements: Achievement[];
  userAchievements: UserAchievement[];
  userStats: UserStats | null;
  loading: boolean;
  error: string | null;
  updateStat: (
    statType: keyof UserStats,
    incrementValue?: number,
  ) => Promise<Achievement[]>;
  refreshAchievements: () => Promise<void>;
  forceSyncAchievements: () => Promise<Achievement[]>;
  getAchievementProgress: (achievementId: string) => number;
  isAchievementUnlocked: (achievementId: string) => boolean;
  totalPoints: number;
  unlockedCount: number;
  totalAchievements: number;
  lastViewedAchievements: number;
  markAchievementsAsViewed: () => void;
}

export function useAchievements(): UseAchievementsReturn {
  const { user } = useAuth();
  const [achievements] = useState<Achievement[]>(ACHIEVEMENTS);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>(
    [],
  );
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastViewedAchievements, setLastViewedAchievements] =
    useState<number>(0);

  const isInitialized = useRef(false);
  const syncInProgress = useRef(false);

  const markAchievementsAsViewed = useCallback(() => {
    if (!user?.uid) return;
    const currentCount = userAchievements.filter((ua) => ua.isUnlocked).length;
    setLastViewedAchievements(currentCount);
    localStorage.setItem(
      `achievements_viewed_${user.uid}`,
      currentCount.toString(),
    );
  }, [user, userAchievements]);

  const loadAchievementsData = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);

      await initializeUserStats(user.uid);
      const stats = await getUserStats(user.uid);

      // ✅ Always check stats against all achievements and write any
      // that are met but not yet recorded — this is the retroactive fix.
      if (stats) {
        await checkAndUnlockAchievements(user.uid, stats);
      }

      // Re-fetch AFTER the check so state reflects what's now in Firestore
      const freshAchievements = await getUserAchievements(user.uid);
      const newUnlockedCount = freshAchievements.filter(
        (a) => a.isUnlocked,
      ).length;

      setUserStats(stats);
      setUserAchievements(freshAchievements);

      // Sync lastViewed from localStorage
      const stored = localStorage.getItem(`achievements_viewed_${user.uid}`);
      if (stored) {
        const viewed = parseInt(stored, 10);
        setLastViewedAchievements(
          viewed <= newUnlockedCount ? viewed : newUnlockedCount,
        );
      } else {
        setLastViewedAchievements(newUnlockedCount);
        localStorage.setItem(
          `achievements_viewed_${user.uid}`,
          newUnlockedCount.toString(),
        );
      }
    } catch (err) {
      console.error("Error loading achievements:", err);
      setError("Failed to load achievements data");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Kept for external callers but now just delegates to loadAchievementsData
  const forceSyncAchievements = useCallback(async () => {
    if (!user?.uid || syncInProgress.current) return [];
    syncInProgress.current = true;
    try {
      await loadAchievementsData();
      // Return any newly unlocked since we can't easily diff here;
      // callers that need the list should use updateStat instead.
      return [];
    } catch (err) {
      console.error("Error force syncing achievements:", err);
      return [];
    } finally {
      syncInProgress.current = false;
    }
  }, [user, loadAchievementsData]);

  // Initialize once when user is available
  useEffect(() => {
    if (user && !isInitialized.current) {
      isInitialized.current = true;
      loadAchievementsData();
    } else if (!user && isInitialized.current) {
      isInitialized.current = false;
      setUserStats(null);
      setUserAchievements([]);
      setLoading(false);
      setError(null);
      setLastViewedAchievements(0);
    }
  }, [user, loadAchievementsData]);

  const updateStat = useCallback(
    async (
      statType: keyof UserStats,
      incrementValue: number = 1,
    ): Promise<Achievement[]> => {
      if (!user?.uid) {
        setError("User not authenticated");
        return [];
      }
      try {
        const newlyUnlocked = await updateStatsAndCheckAchievements(
          user.uid,
          statType,
          incrementValue,
        );
        await loadAchievementsData();
        return newlyUnlocked;
      } catch (err) {
        console.error("Error updating stat:", err);
        setError("Failed to update achievement progress");
        return [];
      }
    },
    [user, loadAchievementsData],
  );

  const refreshAchievements = useCallback(async () => {
    if (user?.uid) {
      await loadAchievementsData();
    }
  }, [user, loadAchievementsData]);

  const getAchievementProgress = useCallback(
    (achievementId: string): number => {
      const achievement = getAchievementById(achievementId);
      if (!achievement || !userStats) return 0;
      let currentValue = 0;
      switch (achievement.requirementType) {
        case "projects_created":
          currentValue = userStats.projectsCreated;
          break;
        case "projects_completed":
          currentValue = userStats.projectsCompleted;
          break;
        case "tasks_created":
          currentValue = userStats.tasksCreated;
          break;
        case "tasks_completed":
          currentValue = userStats.tasksCompleted;
          break;
        case "days_active":
          currentValue = userStats.daysActive;
          break;
        case "team_members_added":
          currentValue = userStats.teamMembersAdded;
          break;
        case "tools_used":
          currentValue = userStats.toolsUsed;
          break;
      }
      return Math.min(currentValue, achievement.requirement);
    },
    [userStats],
  );

  const isAchievementUnlocked = useCallback(
    (achievementId: string): boolean => {
      return userAchievements.some(
        (ua) => ua.achievementId === achievementId && ua.isUnlocked,
      );
    },
    [userAchievements],
  );

  const totalPoints = userAchievements
    .filter((ua) => ua.isUnlocked)
    .reduce((sum, ua) => {
      const achievement = getAchievementById(ua.achievementId);
      return sum + (achievement?.points || 0);
    }, 0);

  const unlockedCount = userAchievements.filter((ua) => ua.isUnlocked).length;
  const totalAchievements = achievements.length;

  return {
    achievements,
    userAchievements,
    userStats,
    loading,
    error,
    updateStat,
    refreshAchievements,
    forceSyncAchievements,
    getAchievementProgress,
    isAchievementUnlocked,
    totalPoints,
    unlockedCount,
    totalAchievements,
    lastViewedAchievements,
    markAchievementsAsViewed,
  };
}
