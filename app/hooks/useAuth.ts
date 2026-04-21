import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";

export type AuthStatus = {
  type: "success" | "error";
  message: string;
} | null;

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<AuthStatus>(null);

  const signUp = async (
    email: string,
    password: string,
    confirmPassword: string,
  ) => {
    if (password !== confirmPassword) {
      setStatus({ type: "error", message: "Passwords do not match." });
      return;
    }
    if (password.length < 6) {
      setStatus({
        type: "error",
        message: "Password must be at least 6 characters.",
      });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setStatus({
        type: "success",
        message: "Account created successfully! Welcome to BuildFlow.",
      });
      router.push("/dashboard");
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "";
      const message =
        code === "auth/email-already-in-use" ?
          "An account with this email already exists."
        : code === "auth/invalid-email" ? "Please enter a valid email address."
        : "Something went wrong. Please try again.";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setStatus(null);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setStatus({ type: "success", message: "Signed in successfully!" });
      router.push("/dashboard");
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "";
      const message =
        code === "auth/user-not-found" || code === "auth/wrong-password" ?
          "Invalid email or password."
        : code === "auth/too-many-requests" ?
          "Too many attempts. Please try again later."
        : "Something went wrong. Please try again.";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "";
      if (code === "auth/popup-closed-by-user") {
        return;
      }
      setStatus({
        type: "error",
        message: "Failed to sign in with Google. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const signInWithGithub = async () => {
    setLoading(true);
    setStatus(null);

    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      router.push("/dashboard");
    } catch (err) {
      const code = err instanceof FirebaseError ? err.code : "";
      if (code === "auth/popup-closed-by-user") return;
      const message =
        code === "auth/account-exists-with-different-credential" ?
          "An account already exists with the same email. Try signing in with Google."
        : "Failed to sign in with GitHub. Please try again.";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setStatus(null);
      router.push("/");
    } catch {
      setStatus({ type: "error", message: "Failed to sign out." });
    } finally {
      setLoading(false);
    }
  };

  const clearStatus = () => setStatus(null);

  return {
    signUp,
    signIn,
    signInWithGoogle,
    signInWithGithub,
    logOut,
    loading,
    status,
    clearStatus,
  };
}
