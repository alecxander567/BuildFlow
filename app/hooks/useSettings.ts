"use client";
import { useState, useEffect } from "react";

export type ThemeMode = "light" | "dark";

export interface ActivityLog {
  id: string;
  action: string;
  timestamp: string;
  userEmail: string | null;
  details?: string;
}

export interface Settings {
  theme: ThemeMode;
  notifications: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  theme: "light",
  notifications: false,
};

// Helper function to apply theme - defined outside to ensure consistency
const applyThemeToDocument = (theme: ThemeMode) => {
  if (typeof window === "undefined") return;

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  // Also save to localStorage as a backup
  localStorage.setItem("theme_preference", theme);
};

// Function to initialize theme on app load
export const initializeTheme = () => {
  if (typeof window === "undefined") return;

  const savedSettings = localStorage.getItem("app_settings");
  if (savedSettings) {
    const parsed = JSON.parse(savedSettings);
    applyThemeToDocument(parsed.theme);
  } else {
    const savedTheme = localStorage.getItem("theme_preference");
    if (savedTheme === "dark" || savedTheme === "light") {
      applyThemeToDocument(savedTheme as ThemeMode);
    }
  }
};

export function useSettings(userEmail?: string | null) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Apply theme to document
  const applyTheme = (theme: ThemeMode) => {
    applyThemeToDocument(theme);
  };

  // Load settings and logs from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      const savedSettings = localStorage.getItem("app_settings");
      if (savedSettings) {
        const parsed: Settings = JSON.parse(savedSettings);
        setSettings(parsed);
        applyTheme(parsed.theme);
      } else {
        // Check for standalone theme preference
        const savedTheme = localStorage.getItem("theme_preference");
        if (savedTheme === "dark") {
          applyTheme("dark");
          setSettings((prev) => ({ ...prev, theme: "dark" }));
        } else {
          applyTheme("light");
        }
      }

      const savedLogs = localStorage.getItem("activity_logs");
      setActivityLogs(savedLogs ? JSON.parse(savedLogs) : []);
      setLoading(false);
    };

    loadSettings();
  }, []);

  // Log an activity entry
  const logActivity = (action: string, details?: string) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      action,
      timestamp: new Date().toISOString(),
      userEmail: userEmail ?? null,
      details,
    };
    setActivityLogs((prev) => {
      const updated = [newLog, ...prev];
      // Keep only last 100 logs to prevent localStorage bloat
      const trimmed = updated.slice(0, 100);
      localStorage.setItem("activity_logs", JSON.stringify(trimmed));
      return trimmed;
    });
  };

  // Persist settings
  const saveSettings = async () => {
    setSaving(true);
    setSaveStatus(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      localStorage.setItem("app_settings", JSON.stringify(settings));
      applyTheme(settings.theme);

      logActivity("Settings Updated", `Theme: ${settings.theme}`);

      setSaveStatus({
        type: "success",
        message: "Settings saved successfully!",
      });
      setTimeout(() => setSaveStatus(null), 3000);
    } catch {
      setSaveStatus({
        type: "error",
        message: "Failed to save settings. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  // Clear all logs
  const clearActivityLogs = () => {
    setActivityLogs([]);
    localStorage.setItem("activity_logs", JSON.stringify([]));
    logActivity("Cleared Activity Logs");
  };

  // Toggle light/dark
  const toggleTheme = () => {
    const newTheme: ThemeMode = settings.theme === "light" ? "dark" : "light";
    // Apply immediately
    applyTheme(newTheme);
    // Update state
    setSettings((prev) => ({ ...prev, theme: newTheme }));
    logActivity("Theme Changed", `Changed to ${newTheme} mode`);
  };

  // Update a single setting field
  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60)
      return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    return date.toLocaleDateString();
  };

  return {
    settings,
    activityLogs,
    loading,
    saving,
    saveStatus,
    updateSetting,
    toggleTheme,
    saveSettings,
    clearActivityLogs,
    formatTimestamp,
  };
}
