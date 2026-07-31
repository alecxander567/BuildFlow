// components/BfcachePrevention.tsx
"use client";

import { useEffect } from "react";

/**
 * Prevents the browser's back/forward cache (bfcache) from restoring
 * a stale page after the user has logged out.
 *
 * When a page is restored from the bfcache, the JavaScript state is
 * frozen — Firebase's `onAuthStateChanged` won't re-fire and the `user`
 * object may still reference the old session. Reloading forces a fresh
 * server request which runs through the proxy auth check in proxy.ts.
 *
 * This component is mounted in the root layout so it runs on every page,
 * covering protected routes that don't use <AuthGuard>.
 */
export default function BfcachePrevention() {
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

  return null;
}