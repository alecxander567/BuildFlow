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
  // Projects only store WHICH tools are selected, not the full catalog.
  // The catalog lives in users/{uid}.tools via useUserTools.
  selectedTools: Record<string, string[]>;
};

export type ProjectInput = Omit<Project, "id" | "userId" | "createdAt">;

function toProject(id: string, raw: Record<string, unknown>): Project {
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
    startDate: (raw.startDate as string) ?? null,
    endDate: (raw.endDate as string) ?? null,
    progress: (raw.progress as number) ?? 0,
    selectedTools: (raw.selectedTools as Record<string, string[]>) ?? {},
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
      const data = snapshot.docs.map((d) =>
        toProject(d.id, d.data() as Record<string, unknown>),
      );
      setProjects(data);
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
      const docRef = await addDoc(collection(db, "projects"), {
        ...input,
        selectedTools: input.selectedTools ?? {},
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
      const payload = {
        ...input,
        selectedTools: input.selectedTools ?? {},
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
          const data = snapshot.docs.map((d) =>
            toProject(d.id, d.data() as Record<string, unknown>),
          );
          setProjects(data);
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
    deleteProject,
    refetch: fetchProjects,
  };
}
