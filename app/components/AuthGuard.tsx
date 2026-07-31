// components/AuthGuard.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, authLoading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      // Replace so the protected page is wiped from history —
      // pressing Back won't return to it.
      router.replace("/");
    }
  }, [user, authLoading, router]);

  // Prevent bfcache (back/forward cache) from restoring a protected
  // page after the user has logged out. When a page is restored from
  // the bfcache, the JavaScript state is stale — the `user` object
  // might still reference the old session. Reloading forces a fresh
  // server request which runs through the proxy auth check.
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        // Page was restored from bfcache — reload to re-validate auth
        window.location.reload();
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

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