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

const ensureServiceWorkerReady =
  async (): Promise<ServiceWorkerRegistration | null> => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return null;
    }

    try {
      // Unregister stale /api/-scoped SWs
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const reg of registrations) {
        if (reg.scope.includes("/api/")) {
          await reg.unregister();
        }
      }

      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
        { scope: "/" },
      );

      if (registration.active) {
        return registration;
      }

      await new Promise<void>((resolve) => {
        if (registration.active) {
          resolve();
          return;
        }

        const sw = registration.installing ?? registration.waiting;
        if (!sw) {
          navigator.serviceWorker.addEventListener(
            "controllerchange",
            () => resolve(),
            { once: true },
          );
          return;
        }

        sw.addEventListener("statechange", function handler() {
          if (sw.state === "activated" || sw.state === "redundant") {
            sw.removeEventListener("statechange", handler);
            resolve();
          }
        });
      });

      const readyReg = await navigator.serviceWorker.ready;
      return readyReg;
    } catch (error) {
      console.error("SW registration failed:", error);
      return null;
    }
  };

export const requestNotificationPermission = async (): Promise<
  string | null
> => {
  if (typeof window === "undefined") return null;

  // Debug: verify env vars are loaded
  if (!process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY) {
    console.error(
      "VAPID key is missing — check NEXT_PUBLIC_FIREBASE_VAPID_KEY in .env.local",
    );
    return null;
  }

  try {
    if (Notification.permission !== "granted") {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") return null;
    }

    // Register SW after permission is granted
    const registration = await ensureServiceWorkerReady();
    if (!registration) {
      console.error("Service worker not ready");
      return null;
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

    if (!token) {
      console.error("getToken returned empty — check VAPID key and FCM config");
    }

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
