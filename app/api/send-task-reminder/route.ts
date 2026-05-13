// app/api/send-task-reminder/route.ts
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

export async function POST(request: Request) {
  try {
    const { userId, projectTitle, taskText, projectId } = await request.json();

    // Get user's FCM token from Firestore
    const userDoc = await admin
      .firestore()
      .collection("users")
      .where("uid", "==", userId)
      .get();

    if (userDoc.empty) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const fcmToken = userDoc.docs[0].data().fcmToken;
    if (!fcmToken) {
      return NextResponse.json(
        { error: "User has no FCM token" },
        { status: 400 },
      );
    }

    const message = {
      notification: {
        title: `📋 Task Reminder: ${projectTitle}`,
        body: `Task: "${taskText}" - Don't forget to complete this today!`,
      },
      data: {
        projectId: projectId,
        type: "task_reminder",
        clickAction: "/projects",
      },
      token: fcmToken,
    };

    const response = await admin.messaging().send(message);

    return NextResponse.json({
      success: true,
      messageId: response,
    });
  } catch (error) {
    console.error("Error sending reminder:", error);
    return NextResponse.json(
      { error: "Failed to send reminder" },
      { status: 500 },
    );
  }
}
