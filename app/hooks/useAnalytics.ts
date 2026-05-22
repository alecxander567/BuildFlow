"use client";

import { useState, useMemo } from "react";
import { useAchievements } from "@/app/hooks/useAchievements";
import { useProjects } from "@/app/hooks/useProject";
import { useUserTools } from "@/app/hooks/useUserTools";
import { useAuth } from "@/app/hooks/useAuth";

export type TimeRange = "all" | "month" | "week";

export interface ToolStats {
  name: string;
  count: number;
  category: string;
  percentage: number;
}

export interface CategoryStats {
  category: string;
  totalUsage: number;
  tools: ToolStats[];
  percentage: number;
}

export interface ToolAnalytics {
  categories: CategoryStats[];
  topTools: ToolStats[];
  totalUsage: number;
  hasData: boolean;
}

export interface ProductivityMetrics {
  totalProjects: number;
  completedProjects: number;
  inProgressProjects: number;
  notStartedProjects: number;
  totalTasks: number;
  completedTasks: number;
  overallProgress: number;
  taskCompletionRate: number;
  projectCompletionRate: number;
}

// Normalizes inconsistent category names saved across older projects
// so they all merge into a single canonical category in analytics.
function normalizeCategory(cat: string): string {
  const lower = cat.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (lower.includes("framework") || lower.includes("librar")) {
    return "Frameworks & Libraries";
  }
  return cat;
}

export function useAnalytics() {
  const { user, authLoading } = useAuth();
  const { projects: allProjects, loading: projectsLoading } = useProjects(
    user,
    authLoading,
  );
  const { userStats, totalPoints, unlockedCount, totalAchievements } =
    useAchievements();
  const { userTools, loaded: toolsLoaded } = useUserTools(user);

  const [timeRange, setTimeRange] = useState<TimeRange>("all");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const isLoading = projectsLoading || authLoading || !toolsLoaded;

  const projects = useMemo(
    () => allProjects.filter((p) => p.userId === user?.uid),
    [allProjects, user],
  );

  const filteredProjects = useMemo(() => {
    if (timeRange === "all") return projects;

    const now = new Date();
    const cutoff = new Date();
    if (timeRange === "month") cutoff.setMonth(now.getMonth() - 1);
    else if (timeRange === "week") cutoff.setDate(now.getDate() - 7);

    return projects.filter((p) => {
      if (!p.createdAt) return false;
      return p.createdAt.toDate() >= cutoff;
    });
  }, [projects, timeRange]);

  const productivityMetrics = useMemo((): ProductivityMetrics => {
    const totalProjects = filteredProjects.length;
    const completedProjects = filteredProjects.filter(
      (p) => p.progress === 100,
    ).length;
    const inProgressProjects = filteredProjects.filter(
      (p) => p.progress > 0 && p.progress < 100,
    ).length;
    const notStartedProjects = filteredProjects.filter(
      (p) => p.progress === 0,
    ).length;

    const totalTasks = filteredProjects.reduce((sum, p) => {
      return sum + Object.values(p.dailyPlan || {}).flat().length;
    }, 0);

    const completedTasks = filteredProjects.reduce((sum, p) => {
      return (
        sum +
        Object.values(p.dailyPlan || {})
          .flat()
          .filter((t) => t.done).length
      );
    }, 0);

    const overallProgress =
      totalProjects > 0 ?
        Math.round(
          filteredProjects.reduce((sum, p) => sum + p.progress, 0) /
            totalProjects,
        )
      : 0;

    const taskCompletionRate =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const projectCompletionRate =
      totalProjects > 0 ?
        Math.round((completedProjects / totalProjects) * 100)
      : 0;

    return {
      totalProjects,
      completedProjects,
      inProgressProjects,
      notStartedProjects,
      totalTasks,
      completedTasks,
      overallProgress,
      taskCompletionRate,
      projectCompletionRate,
    };
  }, [filteredProjects]);

  const toolAnalytics = useMemo((): ToolAnalytics => {
    const toolCounts: Record<string, { count: number; category: string }> = {};

    filteredProjects.forEach((project) => {
      Object.entries(project.selectedTools || {}).forEach(
        ([category, tools]) => {
          const normalizedCategory = normalizeCategory(category);
          tools.forEach((tool) => {
            const key = `${normalizedCategory}:${tool}`;
            if (!toolCounts[key])
              toolCounts[key] = { count: 0, category: normalizedCategory };
            toolCounts[key].count++;
          });
        },
      );
    });

    const totalUsage = Object.values(toolCounts).reduce(
      (sum, t) => sum + t.count,
      0,
    );
    const categoryMap = new Map<string, CategoryStats>();

    Object.entries(toolCounts).forEach(([key, data]) => {
      const toolName = key.split(":")[1];
      const toolStats: ToolStats = {
        name: toolName,
        count: data.count,
        category: data.category,
        percentage: totalUsage > 0 ? (data.count / totalUsage) * 100 : 0,
      };

      if (!categoryMap.has(data.category)) {
        categoryMap.set(data.category, {
          category: data.category,
          totalUsage: 0,
          tools: [],
          percentage: 0,
        });
      }

      const cat = categoryMap.get(data.category)!;
      cat.totalUsage += data.count;
      cat.tools.push(toolStats);
    });

    categoryMap.forEach((cat) => {
      cat.tools.sort((a, b) => b.count - a.count);
      cat.percentage = totalUsage > 0 ? (cat.totalUsage / totalUsage) * 100 : 0;
    });

    const categories = Array.from(categoryMap.values()).sort(
      (a, b) => b.totalUsage - a.totalUsage,
    );

    const allTools = Object.entries(toolCounts).map(([key, data]) => ({
      name: key.split(":")[1],
      count: data.count,
      category: data.category,
      percentage: totalUsage > 0 ? (data.count / totalUsage) * 100 : 0,
    }));
    allTools.sort((a, b) => b.count - a.count);

    return {
      categories,
      topTools: allTools.slice(0, 5),
      totalUsage,
      hasData: totalUsage > 0,
    };
  }, [filteredProjects]);

  const productivityScore = useMemo(() => {
    if (filteredProjects.length === 0) return 0;

    const achievementScore =
      totalAchievements > 0 ? (unlockedCount / totalAchievements) * 100 : 0;
    const projectScore = Math.min(
      100,
      (productivityMetrics.totalProjects / 20) * 100,
    );

    return Math.round(
      productivityMetrics.projectCompletionRate * 0.4 +
        productivityMetrics.taskCompletionRate * 0.3 +
        projectScore * 0.2 +
        achievementScore * 0.1,
    );
  }, [
    productivityMetrics,
    unlockedCount,
    totalAchievements,
    filteredProjects.length,
  ]);

  return {
    // state
    timeRange,
    setTimeRange,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    // derived data
    filteredProjects,
    productivityMetrics,
    toolAnalytics,
    productivityScore,
    mostUsedTool: toolAnalytics.topTools[0] ?? null,
    // achievements
    totalPoints,
    unlockedCount,
    totalAchievements,
  };
}
