"use client";

import dynamic from "next/dynamic";
import { useAuth } from "@/app/hooks/useAuth";

const Chat = dynamic(() => import("./Chat"), {
  ssr: false,
  loading: () => null,
});

export default function ChatWrapper() {
  const { user, authLoading } = useAuth();

  // Don't show chat while checking authentication or if user is not logged in
  if (authLoading || !user) {
    return null;
  }

  return <Chat />;
}
