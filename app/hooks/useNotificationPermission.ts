// app/hooks/useNotificationPermission.ts
import { useState, useEffect } from "react";
import { requestNotificationPermission } from "@/app/lib/firebase";
import { auth, db } from "@/app/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export const useNotificationPermission = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permissionState, setPermissionState] =
    useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Wait for auth to be ready before checking Firestore
    // auth.currentUser is null on first render — onAuthStateChanged fixes this
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      if ("Notification" in window) {
        setPermissionState(Notification.permission);
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        const data = userDoc.data();
        const hasToken = !!data?.fcmToken;
        const notificationsEnabledInDb = data?.notificationsEnabled === true;

        setNotificationsEnabled(
          Notification.permission === "granted" &&
            hasToken &&
            notificationsEnabledInDb,
        );
      } catch (error) {
        console.error("Error checking user document:", error);
      }
    });

    return () => unsubscribe();
  }, []);

  const enableNotifications = async () => {
    if (!auth.currentUser) {
      return false;
    }

    setLoading(true);
    try {
      // requestNotificationPermission handles everything:
      // SW registration, permission prompt, and token retrieval
      const token = await requestNotificationPermission();

      if (token) {
        await setDoc(
          doc(db, "users", auth.currentUser.uid),
          {
            fcmToken: token,
            notificationsEnabled: true,
            updatedAt: new Date(),
          },
          { merge: true },
        );

        setNotificationsEnabled(true);
        setPermissionState("granted");
        return true;
      } else {
        setPermissionState(Notification.permission);
        return false;
      }
    } catch (error) {
      console.error("Error enabling notifications:", error);
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      setPermissionState(Notification.permission);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const disableNotifications = async () => {
    if (!auth.currentUser) return;

    setLoading(true);
    try {
      await setDoc(
        doc(db, "users", auth.currentUser.uid),
        {
          notificationsEnabled: false,
          updatedAt: new Date(),
        },
        { merge: true },
      );

      setNotificationsEnabled(false);
    } catch (error) {
      console.error("Error disabling notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleNotifications = async () => {
    if (loading) {
      return false;
    }

    try {
      if (notificationsEnabled) {
        await disableNotifications();
        return true;
      } else {
        const success = await enableNotifications();
        return success;
      }
    } catch (error) {
      console.error("Error in toggleNotifications:", error);
      return false;
    }
  };

  return {
    notificationsEnabled,
    loading,
    permissionState,
    toggleNotifications,
    enableNotifications,
    disableNotifications,
  };
};
