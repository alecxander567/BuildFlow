// lib/achievements/achievementsConfig.ts
import { Achievement } from "@/app/types/achievements";

export const ACHIEVEMENTS: Achievement[] = [
  // Projects Category
  {
    id: "first_project",
    title: "Project Starter",
    description: "Create your first project",
    icon: "ProjectIcon",
    requirement: 1,
    requirementType: "projects_created",
    category: "projects",
    points: 100,
    badgeColor: "#E8610A",
  },
  {
    id: "project_master",
    title: "Project Master",
    description: "Create 5 projects",
    icon: "ProjectIcon",
    requirement: 5,
    requirementType: "projects_created",
    category: "projects",
    points: 500,
    badgeColor: "#E8610A",
  },
  {
    id: "project_legend",
    title: "Project Legend",
    description: "Create 10 projects",
    icon: "ProjectIcon",
    requirement: 10,
    requirementType: "projects_created",
    category: "projects",
    points: 1000,
    badgeColor: "#E8610A",
  },

  // Tasks Category
  {
    id: "task_novice",
    title: "Task Novice",
    description: "Complete 10 tasks",
    icon: "TaskIcon",
    requirement: 10,
    requirementType: "tasks_completed",
    category: "tasks",
    points: 100,
    badgeColor: "#10B981",
  },
  {
    id: "task_machine",
    title: "Task Machine",
    description: "Complete 50 tasks",
    icon: "TaskIcon",
    requirement: 50,
    requirementType: "tasks_completed",
    category: "tasks",
    points: 500,
    badgeColor: "#10B981",
  },
  {
    id: "task_terminator",
    title: "Task Terminator",
    description: "Complete 100 tasks",
    icon: "TaskIcon",
    requirement: 100,
    requirementType: "tasks_completed",
    category: "tasks",
    points: 1000,
    badgeColor: "#10B981",
  },

  // Streak Category
  {
    id: "consistency",
    title: "Consistency",
    description: "Active for 7 days in a row",
    icon: "StreakIcon",
    requirement: 7,
    requirementType: "days_active",
    category: "streak",
    points: 300,
    badgeColor: "#8B5CF6",
  },
  {
    id: "dedication",
    title: "Dedication",
    description: "Active for 30 days",
    icon: "StreakIcon",
    requirement: 30,
    requirementType: "days_active",
    category: "streak",
    points: 1000,
    badgeColor: "#8B5CF6",
  },

  // Social Category
  {
    id: "team_player",
    title: "Team Player",
    description: "Add 3 team members to your projects",
    icon: "SocialIcon",
    requirement: 3,
    requirementType: "team_members_added",
    category: "social",
    points: 200,
    badgeColor: "#3B82F6",
  },

  // Tools Category
  {
    id: "tool_explorer",
    title: "Tool Explorer",
    description: "Use 5 different tools in Tool Hub",
    icon: "ToolIcon",
    requirement: 5,
    requirementType: "tools_used",
    category: "tools",
    points: 400,
    badgeColor: "#F59E0B",
  },

  // Additional Achievements
  {
    id: "task_creator",
    title: "Task Creator",
    description: "Create 20 tasks across your projects",
    icon: "TaskIcon",
    requirement: 20,
    requirementType: "tasks_created",
    category: "tasks",
    points: 300,
    badgeColor: "#10B981",
  },
  {
    id: "project_completer",
    title: "Project Completer",
    description: "Complete 3 projects (all tasks done)",
    icon: "ProjectIcon",
    requirement: 3,
    requirementType: "projects_completed",
    category: "projects",
    points: 600,
    badgeColor: "#E8610A",
  },
];

// Helper to get achievement by ID
export const getAchievementById = (id: string): Achievement | undefined => {
  return ACHIEVEMENTS.find((a) => a.id === id);
};

// Helper to get achievements by category
export const getAchievementsByCategory = (category: string): Achievement[] => {
  return ACHIEVEMENTS.filter((a) => a.category === category);
};
