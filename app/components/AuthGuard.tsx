// components/AuthGuard.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      // Replace so the protected page is wiped from history —
      // pressing Back won't return to it.
      router.replace("/");
      return;
    }

    // Prevent browser cache from serving this page after logout.
    // When the user hits Back, the browser re-validates with the server
    // instead of showing a stale cached copy.
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", window.location.href);
      const blockBack = () => {
        if (!user) router.replace("/");
        else window.history.pushState(null, "", window.location.href);
      };
      window.addEventListener("popstate", blockBack);
      return () => window.removeEventListener("popstate", blockBack);
    }
  }, [user, authLoading, router]);

  // While Firebase is checking auth state, show a neutral loader
  if (authLoading) {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{ backgroundColor: "var(--bg-base)" }}>
        <div className="text-center">
          <div
            className="inline-block h-9 w-9 animate-spin rounded-full border-4 border-t-transparent"
            style={{
              borderColor: "var(--accent)",
              borderTopColor: "transparent",
            }}
          />
          <p
            className="mt-3 text-sm"
            style={{ color: "var(--text-secondary)" }}>
            Loading…
          </p>
        </div>
      </div>
    );
  }

  // Not authenticated — render nothing while redirect happens
  if (!user) return null;

  return <>{children}</>;
}
