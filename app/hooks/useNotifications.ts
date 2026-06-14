// app/hooks/useNotifications.ts
import { useEffect, useState } from "react";
import { db, auth } from "@/app/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  writeBatch,
  Timestamp,
  limit,
} from "firebase/firestore";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  read: boolean;
  projectId?: string | null;
  taskId?: string | null;
  createdAt: Timestamp;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubSnap: (() => void) | undefined;

    const unsubAuth = onAuthStateChanged(auth, (user) => {
      // Cleanup any previous snapshot listener when auth state changes
      if (unsubSnap) {
        unsubSnap();
        unsubSnap = undefined;
      }

      if (!user) {
        setNotifications([]);
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "notifications"),
        where("userId", "==", user.uid),
        where("deleted", "!=", true),
        orderBy("deleted"),
        orderBy("createdAt", "desc"),
        limit(30),
      );

      unsubSnap = onSnapshot(
        q,
        (snap) => {
          setNotifications(
            snap.docs.map(
              (d) => ({ id: d.id, ...d.data() }) as AppNotification,
            ),
          );
          setLoading(false);
        },
        (err) => {
          console.error("useNotifications snapshot error:", err);
          setLoading(false);
        },
      );
    });

    return () => {
      unsubAuth();
      if (unsubSnap) unsubSnap();
    };
  }, []);

  async function markAllRead() {
    const unread = notifications.filter((n) => !n.read);
    if (!unread.length) return;
    const batch = writeBatch(db);
    unread.forEach((n) =>
      batch.update(doc(db, "notifications", n.id), { read: true }),
    );
    await batch.commit();
  }

  async function markOneRead(id: string) {
    await updateDoc(doc(db, "notifications", id), { read: true });
  }

  async function dismiss(id: string) {
    await updateDoc(doc(db, "notifications", id), { deleted: true });
  }

  return { notifications, loading, markAllRead, markOneRead, dismiss };
}
