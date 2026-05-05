// app/lib/firebase/statsUpdater.ts
import { doc, updateDoc, increment, Timestamp } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

export async function updateUserStat(
  userId: string,
  statType: string,
  incrementValue: number = 1,
) {
  if (!userId) return;

  const userStatsRef = doc(db, "userStats", userId);
  await updateDoc(userStatsRef, {
    [statType]: increment(incrementValue),
    lastUpdated: Timestamp.now(),
  });
}
