// app/api/daily-notifications/route.ts
import { NextResponse } from "next/server";
import admin from "firebase-admin";
import {
  getTodayPendingTasks,
  wasNotificationSentToday,
  logNotification,
} from "@/app/lib/notificationService";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

// app/api/daily-notifications/route.ts
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET_KEY;

  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = admin.firestore();
    const today = new Date().toISOString().split("T")[0];
    console.log("Today:", today);

    // Step 1: Check projects
    const projectsSnapshot = await db.collection("projects").get();
    console.log("Total projects:", projectsSnapshot.size);

    // Step 2: Check each project's dailyPlan
    for (const projectDoc of projectsSnapshot.docs) {
      const project = projectDoc.data();
      console.log(`Project: ${project.title}, userId: ${project.userId}`);

      const dailyPlan = project.dailyPlan || {};
      const todayKeys = Object.keys(dailyPlan);
      console.log(`  dailyPlan dates:`, todayKeys);

      const tasksForToday = dailyPlan[today] || [];
      console.log(`  Tasks for ${today}:`, tasksForToday.length);

      const incompleteTasks = tasksForToday.filter((t: any) => !t.done);
      console.log(`  Incomplete tasks:`, incompleteTasks.length);

      // Step 3: Check user FCM tokens
      const userIds = [
        project.userId,
        ...(project.teamMembers || []).map((m: any) => m.uid),
      ].filter(Boolean);

      for (const uid of userIds) {
        const userDoc = await db.collection("users").doc(uid).get();
        console.log(`  User ${uid} exists:`, userDoc.exists);
        if (userDoc.exists) {
          const data = userDoc.data()!;
          console.log(`    fcmToken:`, !!data.fcmToken);
          console.log(`    notificationsEnabled:`, data.notificationsEnabled);
        }
      }
    }

    // Now run normally
    const pendingTasks = await getTodayPendingTasks();
    console.log("Pending tasks found:", pendingTasks.length);

    // ... rest of your existing code
    const results = [];
    for (const task of pendingTasks) {
      const alreadySent = await wasNotificationSentToday(
        task.userId,
        task.projectId,
        task.id,
      );
      console.log(
        `Task ${task.id} alreadySent:`,
        alreadySent,
        "fcmToken:",
        !!task.fcmToken,
      );

      if (!alreadySent && task.fcmToken) {
        try {
          const title = `📋 Daily Task Reminder: ${task.projectTitle}`;
          const body = `Don't forget: "${task.taskText}"`;

          const message = {
            notification: { title, body },
            data: {
              userId: task.userId,
              projectId: task.projectId,
              taskId: task.id,
              type: "daily_task_reminder",
              clickAction: "/projects",
            },
            token: task.fcmToken,
          };

          const response = await admin.messaging().send(message);
          await logNotification(
            task.userId,
            task.projectId,
            task.id,
            task.taskText,
          );
          await admin.firestore().collection("notifications").add({
            userId: task.userId,
            title,
            message: body,
            type: "warning",
            read: false,
            projectId: task.projectId,
            taskId: task.id,
            deleted: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
          });

          results.push({ task: task.id, status: "sent", messageId: response });
        } catch (error) {
          console.error(`Failed for task ${task.id}:`, error);
          results.push({
            task: task.id,
            status: "failed",
            error: String(error),
          });
        }
      } else {
        results.push({
          task: task.id,
          status: alreadySent ? "already_sent" : "no_token",
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
