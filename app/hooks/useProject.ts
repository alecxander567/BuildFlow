import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { type User } from "firebase/auth";
import { db } from "@/app/lib/firebase";

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
};

export type ProjectInput = Omit<Project, "id" | "userId" | "createdAt">;

/** All "YYYY-MM-DD" strings between start and end inclusive. Capped at 366. */
export function generateDateRange(start: string, end: string): string[] {
  if (!start || !end) return [];
  const dates: string[] = [];
  const cur = new Date(start + "T00:00:00");
  const last = new Date(end + "T00:00:00");
  if (cur > last) return [];
  while (cur <= last && dates.length <= 366) {
    dates.push(cur.toISOString().split("T")[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

/**
 * 0-100 progress derived entirely from dailyPlan over the project date range.
 * - No tasks → 0
 * - 100 only when every task on every day in the range is done
 */
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
    // Always recompute so a stale stored value never appears in the UI
    progress: computeProgress(dailyPlan, startDate, endDate),
    selectedTools: (raw.selectedTools as Record<string, string[]>) ?? {},
    dailyPlan,
  };
}

export function useProjects(user: User | null, authLoading: boolean) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, "projects"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
      );
      const snapshot = await getDocs(q);
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
      });
      setProjects((prev) => [
        {
          ...input,
          id: docRef.id,
          userId: user.uid,
          createdAt: null,
          selectedTools: input.selectedTools ?? {},
          dailyPlan,
          progress,
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

  /**
   * Lightweight patch — only writes `dailyPlan` + recomputed `progress`.
   * Called by the task-toggle UI on ProjectCard for instant feedback.
   * Optimistic update with rollback on failure.
   */
  const updateDailyPlan = async (
    id: string,
    dailyPlan: DailyPlan,
  ): Promise<void> => {
    const current = projects.find((p) => p.id === id);
    if (!current) return;
    const progress = computeProgress(
      dailyPlan,
      current.startDate,
      current.endDate,
    );
    // Optimistic
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, dailyPlan, progress } : p)),
    );
    try {
      await updateDoc(doc(db, "projects", id), { dailyPlan, progress });
    } catch (err) {
      // Rollback
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

  useEffect(() => {
    if (authLoading || !user) return;
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const q = query(
          collection(db, "projects"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc"),
        );
        const snapshot = await getDocs(q);
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
    refetch: fetchProjects,
  };
}
