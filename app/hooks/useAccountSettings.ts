"use client";
import { useState } from "react";
import {
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/app/lib/firebase";

async function setSessionCookie(user: { getIdToken: () => Promise<string> }) {
  const idToken = await user.getIdToken();
  await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
}

export function useAccountSettings(userEmail?: string | null) {
  const router = useRouter();

  const [newEmail, setNewEmail] = useState(userEmail ?? "");
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailError, setEmailError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [deletePassword, setDeletePassword] = useState("");
  const [deleteSaving, setDeleteSaving] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const updateEmailHandler = async () => {
    setEmailError("");
    if (!newEmail.includes("@")) return setEmailError("Enter a valid email.");
    if (newEmail === userEmail)
      return setEmailError("That's already your email.");

    const user = auth.currentUser;
    if (!user) return setEmailError("No user logged in.");

    setEmailSaving(true);
    try {
      await updateEmail(user, newEmail);
      await setSessionCookie(user);
      return true;
    } catch (err: unknown) {
      if (err instanceof Error && "code" in err) {
        const code = (err as { code: string }).code;
        if (code === "auth/requires-recent-login") {
          setEmailError(
            "Please sign out and sign back in before changing your email.",
          );
        } else if (code === "auth/email-already-in-use") {
          setEmailError("That email is already in use by another account.");
        } else if (code === "auth/invalid-email") {
          setEmailError("Enter a valid email address.");
        } else {
          setEmailError("Failed to update email. Please try again.");
        }
      }
    } finally {
      setEmailSaving(false);
    }
  };

  const updatePasswordHandler = async () => {
    setPasswordError("");
    if (!currentPassword)
      return setPasswordError("Enter your current password.");
    if (newPassword.length < 8)
      return setPasswordError("New password must be at least 8 characters.");
    if (newPassword !== confirmPassword)
      return setPasswordError("Passwords don't match.");

    const user = auth.currentUser;
    if (!user || !user.email) return setPasswordError("No user logged in.");

    setPasswordSaving(true);
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword,
      );
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      return true;
    } catch (err: unknown) {
      if (err instanceof Error && "code" in err) {
        const code = (err as { code: string }).code;
        if (
          code === "auth/wrong-password" ||
          code === "auth/invalid-credential"
        ) {
          setPasswordError("Current password is incorrect.");
        } else if (code === "auth/too-many-requests") {
          setPasswordError("Too many attempts. Please try again later.");
        } else {
          setPasswordError("Failed to update password. Please try again.");
        }
      }
    } finally {
      setPasswordSaving(false);
    }
  };

  const deleteAccountHandler = async () => {
    setDeleteError("");
    if (!deletePassword)
      return setDeleteError("Enter your password to confirm.");

    const user = auth.currentUser;
    if (!user || !user.email) return setDeleteError("No user logged in.");

    setDeleteSaving(true);
    try {
      const credential = EmailAuthProvider.credential(
        user.email,
        deletePassword,
      );
      await reauthenticateWithCredential(user, credential);

      const uid = user.uid;

      // Sign out first so Firebase Auth state clears cleanly
      await auth.signOut();

      // Admin API deletes from both Auth + Firestore
      const res = await fetch("/api/admin/delete-user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      });

      if (!res.ok) throw new Error("API delete failed");

      await fetch("/api/auth/session", { method: "DELETE" });
      router.replace("/");
    } catch (err: unknown) {
      if (err instanceof Error && "code" in err) {
        const code = (err as { code: string }).code;
        if (
          code === "auth/wrong-password" ||
          code === "auth/invalid-credential"
        ) {
          setDeleteError("Incorrect password.");
        } else if (code === "auth/too-many-requests") {
          setDeleteError("Too many attempts. Please try again later.");
        } else {
          setDeleteError("Failed to delete account. Please try again.");
        }
      } else {
        setDeleteError("Failed to delete account. Please try again.");
      }
    } finally {
      setDeleteSaving(false);
    }
  };

  return {
    newEmail,
    setNewEmail,
    emailSaving,
    emailError,
    currentPassword,
    setCurrentPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    passwordSaving,
    passwordError,
    updateEmail: updateEmailHandler,
    updatePassword: updatePasswordHandler,
    deletePassword,
    setDeletePassword,
    deleteSaving,
    deleteError,
    deleteAccount: deleteAccountHandler,
  };
}
