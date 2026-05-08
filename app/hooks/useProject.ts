import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { type User } from "firebase/auth";
import { db } from "@/app/lib/firebase";
import { updateUserStat } from "../lib/firebase/statsUpdater";

export type Priority = "High" | "Moderate" | "Low";

export type ProjectType =
  | "Engineering"
  | "Technology"
  | "Research"
  | "Medical"
  | "Art & Design"
  | "Literature"
  | "Business"
  | "Others";

export type DayTask = {
  id: string;
  text: string;
  done: boolean;
};

export type DailyPlan = Record<string, DayTask[]>;

export type TeamMember = {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: "owner" | "member";
  joinedAt: string;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  projectType: ProjectType;
  priority: Priority;
  imageUrl: string;
  projectUrl: string;
  userId: string;
  createdAt: Timestamp | null;
  startDate: string | null;
  endDate: string | null;
  progress: number;
  selectedTools: Record<string, string[]>;
  dailyPlan: DailyPlan;
  starred: boolean;
  starredBy: string[];
  teamMembers?: TeamMember[];
};

export type ProjectInput = Omit<Project, "id" | "userId" | "createdAt">;

export function generateDateRange(start: string, end: string): string[] {
  if (!start || !end) return [];
  const dates: string[] = [];

  const startDate = new Date(start + "T12:00:00Z");
  const endDate = new Date(end + "T12:00:00Z");

  if (startDate > endDate) return [];

  const currentDate = new Date(startDate);

  while (currentDate <= endDate && dates.length <= 366) {
    const year = currentDate.getUTCFullYear();
    const month = String(currentDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getUTCDate()).padStart(2, "0");
    dates.push(`${year}-${month}-${day}`);
    currentDate.setUTCDate(currentDate.getUTCDate() + 1);
  }

  return dates;
}

export function computeProgress(
  dailyPlan: DailyPlan,
  startDate: string | null,
  endDate: string | null,
): number {
  if (!startDate || !endDate) return 0;
  const dates = generateDateRange(startDate, endDate);
  let total = 0;
  let done = 0;
  for (const d of dates) {
    const tasks = dailyPlan[d] ?? [];
    total += tasks.length;
    done += tasks.filter((t) => t.done).length;
  }
  if (total === 0) return 0;
  return Math.round((done / total) * 100);
}

function toProject(id: string, raw: Record<string, unknown>): Project {
  const dailyPlan = (raw.dailyPlan as DailyPlan) ?? {};
  const startDate = (raw.startDate as string) ?? null;
  const endDate = (raw.endDate as string) ?? null;
  return {
    id,
    title: (raw.title as string) ?? "",
    description: (raw.description as string) ?? "",
    projectType: (raw.projectType as ProjectType) ?? "Technology",
    priority: (raw.priority as Priority) ?? "Moderate",
    imageUrl: (raw.imageUrl as string) ?? "",
    projectUrl: (raw.projectUrl as string) ?? "",
    userId: (raw.userId as string) ?? "",
    createdAt: (raw.createdAt as Timestamp) ?? null,
    startDate,
    endDate,
    progress: computeProgress(dailyPlan, startDate, endDate),
    selectedTools: (raw.selectedTools as Record<string, string[]>) ?? {},
    dailyPlan,
    starred: (raw.starred as boolean) ?? false,
    starredBy: (raw.starredBy as string[]) ?? [],
    // include teamMembers so Team page can filter membership without waiting
    teamMembers: (raw.teamMembers as TeamMember[]) ?? [],
  };
}

export function useProjects(user: User | null, authLoading: boolean) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch ALL projects — Projects page needs to see everyone's projects
  const allProjectsQuery = () =>
    query(collection(db, "projects"), orderBy("createdAt", "desc"));

  const fetchProjects = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const snapshot = await getDocs(allProjectsQuery());
      setProjects(
        snapshot.docs.map((d) =>
          toProject(d.id, d.data() as Record<string, unknown>),
        ),
      );
    } catch (err) {
      setError("Failed to load projects.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (input: ProjectInput): Promise<boolean> => {
    if (!user) return false;
    setLoading(true);
    setError(null);
    try {
      const dailyPlan = input.dailyPlan ?? {};
      const progress = computeProgress(
        dailyPlan,
        input.startDate,
        input.endDate,
      );
      const docRef = await addDoc(collection(db, "projects"), {
        ...input,
        selectedTools: input.selectedTools ?? {},
        dailyPlan,
        progress,
        userId: user.uid,
        createdAt: serverTimestamp(),
        starred: false,
        starredBy: [],
      });

      await updateUserStat(user.uid, "projectsCreated", 1);

      setProjects((prev) => [
        {
          ...input,
          id: docRef.id,
          userId: user.uid,
          createdAt: null,
          selectedTools: input.selectedTools ?? {},
          dailyPlan,
          progress,
          starred: false,
          starredBy: [],
          teamMembers: [],
        },
        ...prev,
      ]);
      return true;
    } catch (err) {
      setError("Failed to add project.");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProject = async (id: string, input: Partial<ProjectInput>) => {
    setLoading(true);
    setError(null);
    try {
      const current = projects.find((p) => p.id === id);
      const mergedStart =
        input.startDate !== undefined ?
          input.startDate
        : (current?.startDate ?? null);
      const mergedEnd =
        input.endDate !== undefined ?
          input.endDate
        : (current?.endDate ?? null);
      const mergedPlan =
        input.dailyPlan !== undefined ?
          input.dailyPlan
        : (current?.dailyPlan ?? {});

      const payload = {
        ...input,
        selectedTools: input.selectedTools ?? current?.selectedTools ?? {},
        dailyPlan: mergedPlan,
        progress: computeProgress(mergedPlan, mergedStart, mergedEnd),
      };
      await updateDoc(doc(db, "projects", id), payload);
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...payload } : p)),
      );
    } catch (err) {
      setError("Failed to update project.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateDailyPlan = async (
    id: string,
    dailyPlan: DailyPlan,
  ): Promise<void> => {
    const current = projects.find((p) => p.id === id);
    if (!current || !user) return;

    let newlyCompletedTasks = 0;

    for (const date in dailyPlan) {
      const newTasks = dailyPlan[date] || [];
      const oldTasks = current.dailyPlan[date] || [];

      for (const newTask of newTasks) {
        const oldTask = oldTasks.find((t) => t.id === newTask.id);
        if (newTask.done && (!oldTask || !oldTask.done)) {
          newlyCompletedTasks++;
        }
      }
    }

    const progress = computeProgress(
      dailyPlan,
      current.startDate,
      current.endDate,
    );

    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, dailyPlan, progress } : p)),
    );

    try {
      await updateDoc(doc(db, "projects", id), { dailyPlan, progress });

      if (newlyCompletedTasks > 0) {
        await updateUserStat(user.uid, "tasksCompleted", newlyCompletedTasks);
      }

      if (progress === 100 && current.progress !== 100) {
        await updateUserStat(user.uid, "projectsCompleted", 1);
      }
    } catch (err) {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === id ?
            { ...p, dailyPlan: current.dailyPlan, progress: current.progress }
          : p,
        ),
      );
      console.error(err);
    }
  };

  const deleteProject = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, "projects", id));
      setProjects((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err) {
      setError("Failed to delete project.");
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const starProject = async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return {
        success: false,
        message: "You must be logged in to star projects",
      };
    }

    try {
      const projectRef = doc(db, "projects", id);
      const project = projects.find((p) => p.id === id);

      if (!project) return { success: false, message: "Project not found" };

      const updatedStarredBy = [...(project.starredBy || []), user.uid];

      await updateDoc(projectRef, {
        starred: true,
        starredBy: updatedStarredBy,
      });

      setProjects((prev) =>
        prev.map((p) =>
          p.id === id ?
            { ...p, starred: true, starredBy: updatedStarredBy }
          : p,
        ),
      );

      return {
        success: true,
        message: `✨ "${project.title}" has been starred!`,
      };
    } catch (err) {
      console.error("Failed to star project:", err);
      return {
        success: false,
        message: "Failed to star project. Please try again.",
      };
    }
  };

  const unstarProject = async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    if (!user) {
      return {
        success: false,
        message: "You must be logged in to unstar projects",
      };
    }

    try {
      const projectRef = doc(db, "projects", id);
      const project = projects.find((p) => p.id === id);

      if (!project) return { success: false, message: "Project not found" };

      const updatedStarredBy = (project.starredBy || []).filter(
        (uid) => uid !== user.uid,
      );

      await updateDoc(projectRef, {
        starred: updatedStarredBy.length > 0,
        starredBy: updatedStarredBy,
      });

      setProjects((prev) =>
        prev.map((p) =>
          p.id === id ?
            {
              ...p,
              starred: updatedStarredBy.length > 0,
              starredBy: updatedStarredBy,
            }
          : p,
        ),
      );

      return {
        success: true,
        message: `⭐ "${project.title}" has been unstarred.`,
      };
    } catch (err) {
      console.error("Failed to unstar project:", err);
      return {
        success: false,
        message: "Failed to unstar project. Please try again.",
      };
    }
  };

  const toggleStar = async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const project = projects.find((p) => p.id === id);
    if (!project) return { success: false, message: "Project not found" };

    return project.starred ? unstarProject(id) : starProject(id);
  };

  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const snapshot = await getDocs(allProjectsQuery());
        if (!cancelled) {
          setProjects(
            snapshot.docs.map((d) =>
              toProject(d.id, d.data() as Record<string, unknown>),
            ),
          );
        }
      } catch (err) {
        if (!cancelled) setError("Failed to load projects.");
        console.error(err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  return {
    projects,
    loading,
    error,
    addProject,
    updateProject,
    updateDailyPlan,
    deleteProject,
    starProject,
    unstarProject,
    toggleStar,
    refetch: fetchProjects,
  };
}
