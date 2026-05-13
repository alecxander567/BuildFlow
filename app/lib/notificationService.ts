// app/lib/notificationService.ts
import { db } from "./firebase";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc, 
  Timestamp,
} from "firebase/firestore";

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

// Rest of your code remains the same, but update the pending tasks to include fcmToken
export const getTodayPendingTasks = async (): Promise<NotificationTask[]> => {
  const today = new Date().toISOString().split("T")[0];
  const pendingTasks: NotificationTask[] = [];

  try {
    const projectsQuery = query(collection(db, "projects"));
    const projectsSnapshot = await getDocs(projectsQuery);

    for (const projectDoc of projectsSnapshot.docs) {
      const project = projectDoc.data();
      const dailyPlan = project.dailyPlan || {};
      const tasksForToday = dailyPlan[today] || [];
      const incompleteTasks = tasksForToday.filter((task: any) => !task.done);

      const teamMembers = project.teamMembers || [];
      const userIds = [
        project.userId,
        ...teamMembers.map((member: any) => member.uid),
      ];

      for (const task of incompleteTasks) {
        for (const userId of userIds) {
          const userDoc = await getDocs(
            query(collection(db, "users"), where("uid", "==", userId)),
          );

          if (!userDoc.empty) {
            const userData = userDoc.docs[0].data();
            const fcmToken = userData.fcmToken;

            if (fcmToken) {
              pendingTasks.push({
                id: `${projectDoc.id}_${task.id}_${userId}`,
                projectId: projectDoc.id,
                projectTitle: project.title,
                date: today,
                taskText: task.text,
                userId: userId,
                userEmail: userData.email || "",
                sent: false,
                createdAt: Timestamp.now(),
                fcmToken: fcmToken, 
              });
            }
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

// Function to check if notification was already sent today
export const wasNotificationSentToday = async (
  userId: string,
  projectId: string,
  taskId: string,
): Promise<boolean> => {
  try {
    const today = new Date().toISOString().split("T")[0];
    const startOfDay = new Date(today + "T00:00:00");
    const endOfDay = new Date(today + "T23:59:59");

    const notificationsQuery = query(
      collection(db, "notificationLogs"),
      where("userId", "==", userId),
      where("projectId", "==", projectId),
      where("taskId", "==", taskId),
      where("sentAt", ">=", Timestamp.fromDate(startOfDay)),
      where("sentAt", "<=", Timestamp.fromDate(endOfDay)),
    );

    const snapshot = await getDocs(notificationsQuery);
    return !snapshot.empty;
  } catch (error) {
    console.error("Error checking notification log:", error);
    return false;
  }
};

// Function to log sent notification
export const logNotification = async (
  userId: string,
  projectId: string,
  taskId: string,
  taskText: string,
): Promise<void> => {
  try {
    await addDoc(collection(db, "notificationLogs"), {
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
