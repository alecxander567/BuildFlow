import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { type User } from "firebase/auth";
import { db } from "@/app/lib/firebase";

// Permanent user-level tool catalog stored at: userTools/{uid}
// This is NOT per-project — it's the user's master list of tools they use.
// Projects only store selectedTools (which subset they picked for that project).

export function useUserTools(user: User | null) {
  const [userTools, setUserTools] = useState<Record<string, string[]>>({});
  // null = not yet loaded, true/false = done
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!user) {
      setUserTools({});
      setLoaded(true);
      return;
    }
    let cancelled = false;

    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "userTools", user.uid));
        if (!cancelled) {
          setUserTools(
            snap.exists() ?
              ((snap.data().tools as Record<string, string[]>) ?? {})
            : {},
          );
        }
      } catch (err) {
        console.error("Failed to load user tools:", err);
        if (!cancelled) setUserTools({});
      } finally {
        if (!cancelled) setLoaded(true);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const saveUserTools = async (tools: Record<string, string[]>) => {
    if (!user) return;
    setUserTools(tools);
    try {
      await setDoc(doc(db, "userTools", user.uid), { tools }, { merge: true });
    } catch (err) {
      console.error("Failed to save user tools:", err);
    }
  };

  return { userTools, saveUserTools, loaded };
}
