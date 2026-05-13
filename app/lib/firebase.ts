// app/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

export const initMessaging = () => {
  if (typeof window !== "undefined") {
    try {
      return getMessaging(app);
    } catch (error) {
      console.error("Error initializing messaging:", error);
      return null;
    }
  }
  return null;
};

// Single source of truth for SW registration — always uses /firebase-messaging-sw.js
const ensureServiceWorkerReady =
  async (): Promise<ServiceWorkerRegistration | null> => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return null;
    }

    try {
      // Unregister any stale /api/ scoped SW left over from old code
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        if (reg.scope.includes("/api/")) {
          await reg.unregister();
        }
      }

      // Register the correct static SW file
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
        { scope: "/" },
      );

      // Already active — good to go
      if (registration.active) {
        return registration;
      }

      // Wait for installing/waiting to become active
      await new Promise<void>((resolve) => {
        const sw = registration.installing ?? registration.waiting;
        if (!sw) {
          resolve();
          return;
        }
        sw.addEventListener("statechange", function handler() {
          if (sw.state === "activated") {
            sw.removeEventListener("statechange", handler);
            resolve();
          }
        });
      });

      // Ensure SW controls this page
      await navigator.serviceWorker.ready;
      return registration;
    } catch (error) {
      console.error("SW registration failed:", error);
      return null;
    }
  };

export const requestNotificationPermission = async (): Promise<
  string | null
> => {
  if (typeof window === "undefined") return null;

  try {
    const registration = await ensureServiceWorkerReady();
    if (!registration) {
      console.error("Service worker not ready");
      return null;
    }

    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return null;
    } else {
    }

    const messaging = initMessaging();
    if (!messaging) {
      console.error("Messaging not initialized");
      return null;
    }

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    return token ?? null;
  } catch (error) {
    console.error("Error getting permission:", error);
    throw error;
  }
};

export const onMessageListener = () => {
  if (typeof window === "undefined") return Promise.resolve();

  return new Promise((resolve) => {
    const messaging = initMessaging();
    if (messaging) {
      onMessage(messaging, (payload) => {
        resolve(payload);
      });
    }
  });
};

export default app;
