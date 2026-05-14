importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyBAGOC3Rdr-Sr7vvw4TvFMGbNrQHGeRwNM",
  authDomain: "buildflow-2f3e7.firebaseapp.com",
  projectId: "buildflow-2f3e7",
  storageBucket: "buildflow-2f3e7.firebasestorage.app",
  messagingSenderId: "542861758792",
  appId: "1:542861758792:web:12f88c7f903ae84102237d",
});

const messaging = firebase.messaging();
const db = firebase.firestore();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message:",
    payload,
  );

  const notificationTitle = payload.notification?.title || "New Notification";
  const notificationOptions = {
    body: payload.notification?.body || "You have a new message",
    icon: "/icon.png",
    data: payload.data,
  };

  // Write to Firestore so the in-app bell picks it up
  const userId = payload.data?.userId;
  if (userId) {
    const type =
      payload.data?.type === "daily_task_reminder" ? "warning"
      : payload.data?.type === "task_reminder" ? "warning"
      : "info";

    db.collection("notifications")
      .add({
        userId,
        title: notificationTitle,
        message: notificationOptions.body,
        type,
        read: false,
        projectId: payload.data?.projectId || null,
        taskId: payload.data?.taskId || null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .catch((err) =>
        console.error("[SW] Failed to write notification to Firestore:", err),
      );
  }

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const projectId = event.notification.data?.projectId;
  const url = projectId ? `/project/${projectId}` : "/projects";
  event.waitUntil(clients.openWindow(url));
});

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(clients.claim());
});
