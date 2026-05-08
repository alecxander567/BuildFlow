// app/hooks/useAuth.ts (updated version)
import { useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { auth, db } from "@/app/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export type AuthStatus = {
  type: "success" | "error";
  message: string;
} | null;

// Helper function to create/update user in Firestore
async function syncUserToFirestore(user: User) {
  if (!user) return;

  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);

  if (!userDoc.exists()) {
    // Create new user document
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split("@")[0] || "User",
      photoURL: user.photoURL || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } else {
    // Update existing user document with latest info
    await setDoc(
      userRef,
      {
        email: user.email,
        displayName: user.displayName || userDoc.data().displayName,
        photoURL: user.photoURL || userDoc.data().photoURL,
        updatedAt: new Date().toISOString(),
      },
      { merge: true },
    );
  }
}

export function useAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [status, setStatus] = useState<AuthStatus>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      // Sync user to Firestore when they log in
      if (firebaseUser) {
        await syncUserToFirestore(firebaseUser);
      }

      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Create user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        email: email,
        displayName: email.split("@")[0], 
        photoURL: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

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
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // Ensure user exists in Firestore
      await syncUserToFirestore(userCredential.user);

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
      const result = await signInWithPopup(auth, provider);

      // Create/update user in Firestore with Google data
      await setDoc(
        doc(db, "users", result.user.uid),
        {
          uid: result.user.uid,
          email: result.user.email,
          displayName:
            result.user.displayName ||
            result.user.email?.split("@")[0] ||
            "User",
          photoURL: result.user.photoURL || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      );

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
      const result = await signInWithPopup(auth, provider);

      // Create/update user in Firestore with GitHub data
      await setDoc(
        doc(db, "users", result.user.uid),
        {
          uid: result.user.uid,
          email: result.user.email,
          displayName:
            result.user.displayName ||
            result.user.email?.split("@")[0] ||
            "User",
          photoURL: result.user.photoURL || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      );

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
    user,
    authLoading,
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
