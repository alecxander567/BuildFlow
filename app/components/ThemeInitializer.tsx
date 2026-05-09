"use client";

import { useEffect } from "react";
import { initializeTheme } from "@/app/hooks/useSettings";

export default function ThemeInitializer() {
  useEffect(() => {
    initializeTheme();
  }, []);

  return null;
}
