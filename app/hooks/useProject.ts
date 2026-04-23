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
};

export type ProjectInput = Omit<Project, "id" | "userId" | "createdAt">;

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
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Project[];
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
        userId: user.uid,
        createdAt: serverTimestamp(),
      });
      setProjects((prev) => [
        { id: docRef.id, ...input, userId: user.uid, createdAt: null },
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
      await updateDoc(doc(db, "projects", id), input);
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...input } : p)),
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
          const data = snapshot.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          })) as Project[];
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
