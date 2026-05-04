import { useState, useMemo, useCallback } from "react";
import { useAuth } from "./useAuth";
import { useProjects } from "./useProject";
import { useAlert } from "@/app/components/Alert";
import type { Project, Priority, ProjectType } from "./useProject";

export type SortOption =
  | "newest"
  | "oldest"
  | "progress-high"
  | "progress-low"
  | "title-asc"
  | "title-desc"
  | "starred";

export type ViewMode = "grid" | "list";

export function useProjectsView() {
  const { user, authLoading } = useAuth();
  const { success, error: showError } = useAlert();
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
    addProject,
    updateProject,
    updateDailyPlan,
    deleteProject,
    toggleStar: originalToggleStar,
    refetch,
  } = useProjects(user, authLoading);

  const toggleStar = useCallback(
    async (id: string): Promise<void> => {
      const result = await originalToggleStar(id);
      if (result.success) {
        success(result.message);
      } else {
        showError(result.message);
      }
    },
    [originalToggleStar, success, showError],
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTypes, setSelectedTypes] = useState<ProjectType[]>([]);
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null,
  );

  const filteredProjects = useMemo(() => {
    let result = [...projects];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query),
      );
    }

    if (selectedTypes.length > 0) {
      result = result.filter((project) =>
        selectedTypes.includes(project.projectType),
      );
    }

    if (selectedPriorities.length > 0) {
      result = result.filter((project) =>
        selectedPriorities.includes(project.priority),
      );
    }

    return result;
  }, [projects, searchQuery, selectedTypes, selectedPriorities]);

  const sortedProjects = useMemo(() => {
    const result = [...filteredProjects];

    switch (sortBy) {
      case "starred":
        return result.sort((a, b) => {
          if (a.starred && !b.starred) return -1;
          if (!a.starred && b.starred) return 1;
          return 0;
        });
      case "newest":
        return result.sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return b.createdAt.seconds - a.createdAt.seconds;
        });
      case "oldest":
        return result.sort((a, b) => {
          if (!a.createdAt) return 1;
          if (!b.createdAt) return -1;
          return a.createdAt.seconds - b.createdAt.seconds;
        });
      case "progress-high":
        return result.sort((a, b) => b.progress - a.progress);
      case "progress-low":
        return result.sort((a, b) => a.progress - b.progress);
      case "title-asc":
        return result.sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return result.sort((a, b) => b.title.localeCompare(a.title));
      default:
        return result;
    }
  }, [filteredProjects, sortBy]);

  const stats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter((p) => p.progress < 100).length;
    const completed = projects.filter((p) => p.progress === 100).length;
    const averageProgress =
      total > 0 ?
        Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / total)
      : 0;

    const byType = {} as Record<ProjectType, number>;
    const projectTypes: ProjectType[] = [
      "Engineering",
      "Technology",
      "Research",
      "Medical",
      "Art & Design",
      "Literature",
      "Business",
      "Others",
    ];
    projectTypes.forEach((type) => {
      byType[type] = 0;
    });
    projects.forEach((p) => {
      byType[p.projectType] = (byType[p.projectType] || 0) + 1;
    });

    const byPriority: Record<Priority, number> = {
      High: 0,
      Moderate: 0,
      Low: 0,
    };
    projects.forEach((p) => {
      byPriority[p.priority]++;
    });

    return {
      total,
      active,
      completed,
      averageProgress,
      byType,
      byPriority,
    };
  }, [projects]);

  const selectedProject = useMemo(() => {
    if (!selectedProjectId) return null;
    return projects.find((p) => p.id === selectedProjectId) || null;
  }, [projects, selectedProjectId]);

  const toggleType = useCallback((type: ProjectType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  }, []);

  const togglePriority = useCallback((priority: Priority) => {
    setSelectedPriorities((prev) =>
      prev.includes(priority) ?
        prev.filter((p) => p !== priority)
      : [...prev, priority],
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedTypes([]);
    setSelectedPriorities([]);
    setSortBy("newest");
  }, []);

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedTypes.length > 0 ||
    selectedPriorities.length > 0;

  const [selectedProjectIds, setSelectedProjectIds] = useState<Set<string>>(
    new Set(),
  );

  const toggleSelection = useCallback((projectId: string) => {
    setSelectedProjectIds((prev) => {
      const next = new Set(prev);
      if (next.has(projectId)) {
        next.delete(projectId);
      } else {
        next.add(projectId);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedProjectIds(new Set(sortedProjects.map((p) => p.id)));
  }, [sortedProjects]);

  const clearSelection = useCallback(() => {
    setSelectedProjectIds(new Set());
  }, []);

  const bulkDelete = useCallback(async () => {
    const results = await Promise.all(
      Array.from(selectedProjectIds).map((id) => deleteProject(id)),
    );
    if (results.every((r) => r === true)) {
      clearSelection();
      return true;
    }
    return false;
  }, [selectedProjectIds, deleteProject, clearSelection]);

  return {
    projects: sortedProjects,
    allProjects: projects,
    loading: projectsLoading || authLoading,
    error: projectsError,
    viewMode,
    setViewMode,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    selectedTypes,
    selectedPriorities,
    toggleType,
    togglePriority,
    clearFilters,
    hasActiveFilters,
    stats,
    selectedProjectId,
    selectedProject,
    setSelectedProjectId,
    selectProject: setSelectedProjectId,
    selectedProjectIds,
    toggleSelection,
    selectAll,
    clearSelection,
    bulkDelete,
    isAllSelected:
      selectedProjectIds.size === sortedProjects.length &&
      sortedProjects.length > 0,
    isSomeSelected: selectedProjectIds.size > 0,
    toggleStar,
    isProjectOwner: (projectUserId: string) => user?.uid === projectUserId,
    addProject,
    updateProject,
    updateDailyPlan,
    deleteProject,
    refetch,
  };
}
