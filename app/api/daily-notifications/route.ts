// app/api/daily-notifications/route.ts
import { NextResponse } from "next/server";
import admin from "firebase-admin";
import {
  getTodayPendingTasks,
  wasNotificationSentToday,
  logNotification,
} from "@/app/lib/notificationService";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET_KEY;

  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const pendingTasks = await getTodayPendingTasks();
    const results = [];

    for (const task of pendingTasks) {
      const alreadySent = await wasNotificationSentToday(
        task.userId,
        task.projectId,
        task.id,
      );

      if (!alreadySent && task.fcmToken) {
        try {
          const message = {
            notification: {
              title: `📋 Daily Task Reminder: ${task.projectTitle}`,
              body: `Don't forget: "${task.taskText}"`,
            },
            data: {
              projectId: task.projectId,
              taskId: task.id,
              type: "daily_task_reminder",
              clickAction: "/projects",
            },
            token: task.fcmToken, // Use the token directly
          };

          const response = await admin.messaging().send(message);

          await logNotification(
            task.userId,
            task.projectId,
            task.id,
            task.taskText,
          );

          results.push({
            task: task.id,
            status: "sent",
            messageId: response,
          });
        } catch (error) {
          console.error(
            `Failed to send notification for task ${task.id}:`,
            error,
          );
          results.push({
            task: task.id,
            status: "failed",
            error: error instanceof Error ? error.message : "Unknown error",
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
    console.error("Error processing daily notifications:", error);
    return NextResponse.json(
      { error: "Failed to process notifications" },
      { status: 500 },
    );
  }
}
