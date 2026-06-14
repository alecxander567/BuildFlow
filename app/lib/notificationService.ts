// app/lib/notificationService.ts
import admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";

export interface NotificationTask {
  id: string;
  projectId: string;
  projectTitle: string;
  date: string;
  taskText: string;
  userId: string;
  userEmail: string;
  sent: boolean;
  createdAt: Timestamp;
  fcmToken?: string;
}

export const getTodayPendingTasks = async (): Promise<NotificationTask[]> => {
  const today = new Date().toISOString().split("T")[0];
  const pendingTasks: NotificationTask[] = [];

  try {
    const db = admin.firestore();
    const projectsSnapshot = await db.collection("projects").get();

    for (const projectDoc of projectsSnapshot.docs) {
      const project = projectDoc.data();
      const dailyPlan = project.dailyPlan || {};
      const tasksForToday = dailyPlan[today] || [];
      const incompleteTasks = tasksForToday.filter((task: any) => !task.done);

      if (incompleteTasks.length === 0) continue;

      const teamMembers = project.teamMembers || [];
      const userIds: string[] = [
        project.userId,
        ...teamMembers.map((member: any) => member.uid),
      ].filter(Boolean);

      for (const task of incompleteTasks) {
        for (const userId of userIds) {
          // Use doc(userId) instead of where("uid", "==", userId)
          const userDoc = await db.collection("users").doc(userId).get();

          if (!userDoc.exists) continue;

          const userData = userDoc.data()!;
          const fcmToken = userData.fcmToken;
          const notificationsEnabled = userData.notificationsEnabled === true;

          if (fcmToken && notificationsEnabled) {
            pendingTasks.push({
              id: `${projectDoc.id}_${task.id}_${userId}`,
              projectId: projectDoc.id,
              projectTitle: project.title,
              date: today,
              taskText: task.text,
              userId,
              userEmail: userData.email || "",
              sent: false,
              createdAt: Timestamp.now(),
              fcmToken,
            });
          }
        }
      }
    }

    return pendingTasks;
  } catch (error) {
    console.error("Error getting pending tasks:", error);
    return [];
  }
};

export const wasNotificationSentToday = async (
  userId: string,
  projectId: string,
  taskId: string,
): Promise<boolean> => {
  try {
    const db = admin.firestore();
    const today = new Date().toISOString().split("T")[0];
    const startOfDay = new Date(today + "T00:00:00");
    const endOfDay = new Date(today + "T23:59:59");

    const snapshot = await db
      .collection("notificationLogs")
      .where("userId", "==", userId)
      .where("projectId", "==", projectId)
      .where("taskId", "==", taskId)
      .where("sentAt", ">=", Timestamp.fromDate(startOfDay))
      .where("sentAt", "<=", Timestamp.fromDate(endOfDay))
      .get();

    return !snapshot.empty;
  } catch (error) {
    console.error("Error checking notification log:", error);
    return false;
  }
};

export const logNotification = async (
  userId: string,
  projectId: string,
  taskId: string,
  taskText: string,
): Promise<void> => {
  try {
    const db = admin.firestore();
    await db.collection("notificationLogs").add({
      userId,
      projectId,
      taskId,
      taskText,
      sentAt: Timestamp.now(),
      date: new Date().toISOString().split("T")[0],
    });
  } catch (error) {
    console.error("Error logging notification:", error);
  }
};
