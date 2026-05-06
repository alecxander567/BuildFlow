import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { type User } from "firebase/auth";
import { db } from "@/app/lib/firebase";

export function useUserTools(user: User | null) {
  const [userTools, setUserTools] = useState<Record<string, string[]>>({});
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setUserTools({});
      setLoaded(true);
      return;
    }

    setLoaded(false);
    let cancelled = false;

    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "userTools", user.uid));
        if (!cancelled) {
          if (snap.exists()) {
            const data = snap.data();
            const tools = data.tools as Record<string, string[]>;
            if (tools && typeof tools === "object") {
              setUserTools(tools);
            } else {
              setUserTools({});
            }
          } else {
            setUserTools({});
          }
        }
      } catch (err) {
        console.error("Failed to load user tools:", err);
        if (!cancelled) {
          setError("Failed to load your tools catalog");
          setUserTools({});
        }
      } finally {
        if (!cancelled) setLoaded(true);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const persist = async (tools: Record<string, string[]>) => {
    if (!user) return false;
    try {
      await setDoc(doc(db, "userTools", user.uid), { tools });
      return true;
    } catch (err) {
      console.error("Failed to save user tools:", err);
      return false;
    }
  };

  const saveUserTools = async (tools: Record<string, string[]>) => {
    setUserTools(tools);
    await persist(tools);
  };

  const addCategory = async (categoryName: string) => {
    if (!user || userTools[categoryName] !== undefined) return false;
    const next = { ...userTools, [categoryName]: [] };
    setUserTools(next);
    return persist(next);
  };

  const deleteCategory = async (categoryName: string) => {
    if (!user || !userTools[categoryName]) return false;
    const next = { ...userTools };
    delete next[categoryName];
    setUserTools(next);
    return persist(next);
  };

  const addTool = async (categoryName: string, toolName: string) => {
    if (!user || !userTools[categoryName]) return false;
    if (userTools[categoryName].includes(toolName)) return false;
    const next = {
      ...userTools,
      [categoryName]: [...userTools[categoryName], toolName],
    };
    setUserTools(next);
    return persist(next);
  };

  const deleteTool = async (categoryName: string, toolName: string) => {
    if (!user || !userTools[categoryName]) return false;
    const next = {
      ...userTools,
      [categoryName]: userTools[categoryName].filter((t) => t !== toolName),
    };
    setUserTools(next);
    return persist(next);
  };

  const updateTool = async (
    categoryName: string,
    oldToolName: string,
    newToolName: string,
  ) => {
    if (!user || !userTools[categoryName]?.includes(oldToolName)) return false;
    const next = {
      ...userTools,
      [categoryName]: userTools[categoryName].map((t) =>
        t === oldToolName ? newToolName : t,
      ),
    };
    setUserTools(next);
    return persist(next);
  };

  const updateCategory = async (
    oldCategoryName: string,
    newCategoryName: string,
  ) => {
    if (!user || !userTools[oldCategoryName] || userTools[newCategoryName])
      return false;
    const next: Record<string, string[]> = {};
    Object.keys(userTools).forEach((key) => {
      next[key === oldCategoryName ? newCategoryName : key] = userTools[key];
    });
    setUserTools(next);
    return persist(next);
  };

  return {
    userTools,
    saveUserTools,
    loaded,
    error,
    addCategory,
    deleteCategory,
    addTool,
    deleteTool,
    updateTool,
    updateCategory,
  };
}
