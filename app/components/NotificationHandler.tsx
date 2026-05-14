// app/components/NotificationHandler.tsx
"use client";

import { useEffect } from "react";
import { useFCM } from "@/app/hooks/useFCM";
import { useRouter } from "next/navigation";
import { db, auth } from "@/app/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function NotificationHandler() {
  const { token, notification } = useFCM();
  const router = useRouter();

  useEffect(() => {
    if (!notification) return;

    const isTaskReminder =
      notification.data?.type === "daily_task_reminder" ||
      notification.data?.type === "task_reminder";

    // 1. Write to Firestore so the TopBar bell reflects it in real time
    const user = auth.currentUser;
    if (user) {
      const type = isTaskReminder ? "warning" : "info";
      addDoc(collection(db, "notifications"), {
        userId: user.uid,
        title: notification.notification?.title ?? "Notification",
        message: notification.notification?.body ?? "",
        type,
        read: false,
        projectId: notification.data?.projectId ?? null,
        taskId: notification.data?.taskId ?? null,
        deleted: false,
        createdAt: serverTimestamp(),
      }).catch((err) =>
        console.error("Failed to write foreground notification:", err),
      );
    }

    // 2. Show a browser Notification for foreground messages
    if (isTaskReminder && Notification.permission === "granted") {
      const notifObj = new Notification(
        notification.notification?.title || "Task Reminder",
        {
          body: notification.notification?.body || "You have pending tasks",
          icon: "/icon.png",
          data: { projectId: notification.data?.projectId },
        },
      );

      notifObj.onclick = (event) => {
        event.preventDefault();
        window.focus();
        router.push(
          notification.data?.projectId ?
            `/project/${notification.data.projectId}`
          : "/projects",
        );
      };
    }
  }, [notification, router]);

  useEffect(() => {
    if (token) {
      localStorage.setItem("fcmToken", token);
    }
  }, [token]);

  return null;
}
