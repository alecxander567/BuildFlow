import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/app/lib/firebase";

export type ResetStatus = {
  type: "success" | "error";
  message: string;
} | null;

export function useResetPassword() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<ResetStatus>(null);

  const sendReset = async (email: string) => {
    if (!email.trim()) {
      setStatus({ type: "error", message: "Please enter your email address." });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      await sendPasswordResetEmail(auth, email);
      setStatus({
        type: "success",
        message:
          "Reset link sent! Check your inbox (and spam folder, just in case).",
      });
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "";
      const message =
        code === "auth/user-not-found" ?
          "No account found with this email address."
        : code === "auth/invalid-email" ? "Please enter a valid email address."
        : code === "auth/too-many-requests" ?
          "Too many requests. Please wait a moment and try again."
        : "Something went wrong. Please try again.";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  const clearStatus = () => setStatus(null);

  return { sendReset, loading, status, clearStatus };
}
