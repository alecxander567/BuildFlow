// app/hooks/useFCM.ts
import { useEffect, useState } from "react";
import {
  requestNotificationPermission,
  onMessageListener,
  auth,
  db,
} from "@/app/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export const useFCM = () => {
  const [notification, setNotification] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const initializeFCM = async () => {
      if (typeof window === "undefined") return;

      if (!("Notification" in window)) {
        return;
      }

      if (!("serviceWorker" in navigator)) {
        return;
      }

      // Only initialize if permission is already granted — don't auto-prompt
      if (Notification.permission !== "granted") {
        return;
      }

      try {
        // requestNotificationPermission handles SW registration internally
        // Do NOT register a SW here — that caused the dual-SW conflict
        const fcmToken = await requestNotificationPermission();

        if (fcmToken) {
          setToken(fcmToken);

          if (auth.currentUser) {
            await setDoc(
              doc(db, "users", auth.currentUser.uid),
              {
                fcmToken,
                updatedAt: new Date(),
              },
              { merge: true },
            );
          }
        }
      } catch (error) {
        console.error("FCM initialization error:", error);
      }
    };

    initializeFCM();

    // Listen for foreground messages
    onMessageListener().then((payload) => {
      if (payload) {
        console.log("Foreground message received:", payload);
        setNotification(payload);
      }
    });
  }, []);

  return { token, notification };
};
