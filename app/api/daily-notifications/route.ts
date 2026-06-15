// app/api/daily-notifications/route.ts
import { NextResponse } from "next/server";
import admin from "firebase-admin";

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
  // Vercel automatically sends Authorization: Bearer <CRON_SECRET>
  // The env var MUST be named exactly CRON_SECRET for this to work
  const authHeader = request.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET;

  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    console.error("Unauthorized cron attempt. Header received:", authHeader);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const db = admin.firestore();
    const today = new Date().toISOString().split("T")[0];
    const results: { task: string; userId: string; status: string }[] = [];

    const projectsSnapshot = await db.collection("projects").get();

    for (const projectDoc of projectsSnapshot.docs) {
      const project = projectDoc.data();
      const dailyPlan = project.dailyPlan || {};
      const tasksForToday = dailyPlan[today] || [];
      const incompleteTasks = tasksForToday.filter((t: any) => !t.done);

      if (incompleteTasks.length === 0) continue;

      // Collect all user IDs (owner + team members)
      const userIds: string[] = [
        project.userId,
        ...(project.teamMembers || []).map((m: any) => m.uid),
      ].filter(Boolean);

      for (const task of incompleteTasks) {
        for (const userId of userIds) {
          try {
            // Check if already notified today for this task
            // NOTE: This query requires a composite index in Firestore.
            // If missing, visit the Firebase console → Firestore → Indexes to create it,
            // or check your server logs for a direct link to create it automatically.
            const existingNotif = await db
              .collection("notifications")
              .where("userId", "==", userId)
              .where("taskId", "==", task.id)
              .where("projectId", "==", projectDoc.id)
              .where("date", "==", today)
              .limit(1)
              .get();

            if (!existingNotif.empty) {
              results.push({ task: task.id, userId, status: "already_sent" });
              continue;
            }

            await db.collection("notifications").add({
              userId,
              title: `📋 Task Reminder: ${project.title}`,
              message: `Don't forget: "${task.text}"`,
              type: "warning",
              read: false,
              projectId: projectDoc.id,
              taskId: task.id,
              date: today,
              deleted: false,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            results.push({ task: task.id, userId, status: "sent" });
          } catch (innerError) {
            // Log per-task errors without aborting the whole run
            console.error(
              `Failed for task ${task.id} / user ${userId}:`,
              innerError,
            );
            results.push({
              task: task.id,
              userId,
              status: `error: ${String(innerError)}`,
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error("Fatal error in daily-notifications cron:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
