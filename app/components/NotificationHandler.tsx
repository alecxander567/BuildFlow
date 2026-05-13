// app/components/NotificationHandler.tsx
"use client";

import { useEffect } from "react";
import { useFCM } from "@/app/hooks/useFCM";
import { useRouter } from "next/navigation";

export default function NotificationHandler() {
  const { token, notification } = useFCM();
  const router = useRouter();

  useEffect(() => {
    if (notification) {
      // Handle task reminder clicks
      if (
        notification.data?.type === "daily_task_reminder" ||
        notification.data?.type === "task_reminder"
      ) {
        // Show custom notification
        if (Notification.permission === "granted") {
          const notificationObj = new Notification(
            notification.notification?.title || "Task Reminder",
            {
              body: notification.notification?.body || "You have pending tasks",
              icon: "/icon.png",
              data: {
                projectId: notification.data?.projectId,
                url: "/projects",
              },
            },
          );

          // Handle notification click
          notificationObj.onclick = (event) => {
            event.preventDefault();
            window.focus();
            router.push(
              notification.data?.projectId ?
                `/project/${notification.data.projectId}`
              : "/projects",
            );
          };
        }
      }
    }
  }, [notification, router]);

  useEffect(() => {
    if (token) {
      // Store token in localStorage for testing
      localStorage.setItem("fcmToken", token);
    }
  }, [token]);

  return null;
}
