"use client";

import { useEffect } from "react";
import { initializeThemeForUser } from "@/app/hooks/useSettings";
import { useAuth } from "@/app/hooks/useAuth";

export default function ThemeInitializer() {
  const { user } = useAuth();

  useEffect(() => {
    if (user?.email) {
      initializeThemeForUser(user.email);
    }
  }, [user?.email]);

  return null;
}
