// app/lib/firebase/achievementService.ts
import { db } from "@/app/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  increment,
} from "firebase/firestore";
import { UserStats, UserAchievement } from "@/app/types/achievements";
import { ACHIEVEMENTS } from "@/app/lib/achievements/achievementsConfig";
import { Achievement } from "@/app/types/achievements";

// Initialize user stats document
export const initializeUserStats = async (userId: string): Promise<void> => {
  const userStatsRef = doc(db, "userStats", userId);
  const userStatsSnap = await getDoc(userStatsRef);

  if (!userStatsSnap.exists()) {
    const initialStats: UserStats = {
      userId,
      projectsCreated: 0,
      projectsCompleted: 0,
      tasksCreated: 0,
      tasksCompleted: 0,
      daysActive: 1,
      teamMembersAdded: 0,
      toolsUsed: 0,
      lastUpdated: new Date(),
    };
    await setDoc(userStatsRef, {
      ...initialStats,
      lastUpdated: Timestamp.fromDate(initialStats.lastUpdated),
    });
  }
};

// Get user stats
export const getUserStats = async (
  userId: string,
): Promise<UserStats | null> => {
  const userStatsRef = doc(db, "userStats", userId);
  const userStatsSnap = await getDoc(userStatsRef);

  if (userStatsSnap.exists()) {
    const data = userStatsSnap.data();
    return {
      userId: data.userId,
      projectsCreated: data.projectsCreated,
      projectsCompleted: data.projectsCompleted,
      tasksCreated: data.tasksCreated,
      tasksCompleted: data.tasksCompleted,
      daysActive: data.daysActive,
      teamMembersAdded: data.teamMembersAdded,
      toolsUsed: data.toolsUsed,
      lastUpdated: data.lastUpdated?.toDate() || new Date(),
    } as UserStats;
  }
  return null;
};

// Update user stats (increment specific fields)
export const updateUserStat = async (
  userId: string,
  statType: keyof UserStats,
  incrementValue: number = 1,
): Promise<void> => {
  const userStatsRef = doc(db, "userStats", userId);
  await updateDoc(userStatsRef, {
    [statType]: increment(incrementValue),
    lastUpdated: Timestamp.now(),
  });
};

// Get user's unlocked achievements
export const getUserAchievements = async (
  userId: string,
): Promise<UserAchievement[]> => {
  const userAchievementsRef = collection(db, "userAchievements");
  const q = query(userAchievementsRef, where("userId", "==", userId));
  const querySnapshot = await getDocs(q);

  return querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      userId: data.userId,
      achievementId: data.achievementId,
      unlockedAt: data.unlockedAt?.toDate() || new Date(),
      progress: data.progress,
      isUnlocked: data.isUnlocked,
    };
  });
};

// Check and unlock achievements based on current stats
export const checkAndUnlockAchievements = async (
  userId: string,
  stats: UserStats,
): Promise<Achievement[]> => {
  const unlockedAchievements = await getUserAchievements(userId);
  const unlockedIds = new Set(
    unlockedAchievements.map((ua) => ua.achievementId),
  );

  const newlyUnlocked: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    // Skip if already unlocked
    if (unlockedIds.has(achievement.id)) continue;

    let currentValue = 0;
    switch (achievement.requirementType) {
      case "projects_created":
        currentValue = stats.projectsCreated;
        break;
      case "projects_completed":
        currentValue = stats.projectsCompleted;
        break;
      case "tasks_created":
        currentValue = stats.tasksCreated;
        break;
      case "tasks_completed":
        currentValue = stats.tasksCompleted;
        break;
      case "days_active":
        currentValue = stats.daysActive;
        break;
      case "team_members_added":
        currentValue = stats.teamMembersAdded;
        break;
      case "tools_used":
        currentValue = stats.toolsUsed;
        break;
    }

    // Check if achievement should be unlocked
    if (currentValue >= achievement.requirement) {
      const userAchievement: UserAchievement = {
        userId,
        achievementId: achievement.id,
        unlockedAt: new Date(),
        progress: achievement.requirement,
        isUnlocked: true,
      };

      // Save to Firebase
      const userAchievementRef = doc(
        db,
        "userAchievements",
        `${userId}_${achievement.id}`,
      );
      await setDoc(userAchievementRef, {
        ...userAchievement,
        unlockedAt: Timestamp.fromDate(userAchievement.unlockedAt),
      });

      newlyUnlocked.push(achievement);
      unlockedIds.add(achievement.id);
    }
  }

  return newlyUnlocked;
};

// Helper function to update stats and check achievements in one go
export const updateStatsAndCheckAchievements = async (
  userId: string,
  statType: keyof UserStats,
  incrementValue: number = 1,
): Promise<Achievement[]> => {
  // Update the stat
  await updateUserStat(userId, statType, incrementValue);

  // Get updated stats
  const updatedStats = await getUserStats(userId);
  if (!updatedStats) return [];

  // Check for newly unlocked achievements
  const newlyUnlocked = await checkAndUnlockAchievements(userId, updatedStats);

  return newlyUnlocked;
};
