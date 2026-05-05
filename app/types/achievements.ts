// types/achievements.ts
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; 
  requirement: number;
  requirementType:
    | "projects_created"
    | "tasks_completed"
    | "days_active"
    | "team_members_added"
    | "tools_used"
    | "tasks_created"
    | "projects_completed";
  category: "projects" | "tasks" | "streak" | "social" | "tools";
  points: number;
  badgeColor: string;
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: Date;
  progress: number;
  isUnlocked: boolean;
}

export interface UserStats {
  userId: string;
  projectsCreated: number;
  projectsCompleted: number;
  tasksCreated: number;
  tasksCompleted: number;
  daysActive: number;
  teamMembersAdded: number;
  toolsUsed: number;
  lastUpdated: Date;
}
