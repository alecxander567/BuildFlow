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

// Sentinel used to detect "we haven't loaded for any user yet", distinct
// from every valid value of `userEmail` (including null and undefined).
const UNLOADED: unique symbol = Symbol("unloaded");
type UserKey = string | null | undefined;

// Helper function to apply theme - defined outside to ensure consistency
const applyThemeToDocument = (theme: ThemeMode) => {
  if (typeof window === "undefined") return;

  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

// Get user-specific storage keys
const getSettingsKey = (userEmail: string) => `app_settings_${userEmail}`;
const getActivityLogsKey = (userEmail: string) => `activity_logs_${userEmail}`;
const getThemePreferenceKey = (userEmail: string) =>
  `theme_preference_${userEmail}`;

// Function to initialize theme on app load (requires user email)
export const initializeThemeForUser = (userEmail?: string | null) => {
  if (typeof window === "undefined" || !userEmail) return;

  const settingsKey = getSettingsKey(userEmail);
  const savedSettings = localStorage.getItem(settingsKey);
  if (savedSettings) {
    const parsed = JSON.parse(savedSettings);
    applyThemeToDocument(parsed.theme);
  } else {
    const themeKey = getThemePreferenceKey(userEmail);
    const savedTheme = localStorage.getItem(themeKey);
    if (savedTheme === "dark" || savedTheme === "light") {
      applyThemeToDocument(savedTheme as ThemeMode);
    }
  }
};

// Pure, synchronous read of a user's settings + logs from localStorage.
// Kept as a plain function (not an Effect) since it has no async work and
// no external subscription — it's just derived data for a given userEmail.
function loadForUser(userEmail: string): {
  settings: Settings;
  activityLogs: ActivityLog[];
} {
  const settingsKey = getSettingsKey(userEmail);
  const savedSettings = localStorage.getItem(settingsKey);

  let settings: Settings;
  if (savedSettings) {
    settings = JSON.parse(savedSettings) as Settings;
  } else {
    const themeKey = getThemePreferenceKey(userEmail);
    const savedTheme = localStorage.getItem(themeKey);
    settings = {
      ...DEFAULT_SETTINGS,
      theme: savedTheme === "dark" ? "dark" : "light",
    };
  }

  const logsKey = getActivityLogsKey(userEmail);
  const savedLogs = localStorage.getItem(logsKey);
  const activityLogs: ActivityLog[] = savedLogs ? JSON.parse(savedLogs) : [];

  return { settings, activityLogs };
}

export function useSettings(userEmail?: string | null) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Tracks which userEmail the current settings/activityLogs state was
  // loaded for. Adjust state directly during render when userEmail changes
  // (per https://react.dev/learn/you-might-not-need-an-effect) instead of
  // using an Effect just to call setState synchronously.
  const [loadedFor, setLoadedFor] = useState<UserKey | typeof UNLOADED>(
    UNLOADED,
  );

  if (userEmail !== loadedFor) {
    setLoadedFor(userEmail);
    if (userEmail) {
      const { settings: loaded, activityLogs: loadedLogs } =
        loadForUser(userEmail);
      setSettings(loaded);
      setActivityLogs(loadedLogs);
    } else {
      setSettings(DEFAULT_SETTINGS);
      setActivityLogs([]);
    }
  }

  const loading = loadedFor === UNLOADED;

  // Keep the document's theme class in sync with settings.theme. This is a
  // genuine external-system synchronization (mutating the DOM), so it
  // belongs in an Effect — it just doesn't call setState.
  useEffect(() => {
    applyThemeToDocument(settings.theme);
  }, [settings.theme]);

  // Apply theme to document
  const applyTheme = (theme: ThemeMode) => {
    applyThemeToDocument(theme);
  };

  // Save settings to localStorage (internal function)
  const persistSettings = (newSettings: Settings) => {
    if (!userEmail) return;
    const settingsKey = getSettingsKey(userEmail);
    localStorage.setItem(settingsKey, JSON.stringify(newSettings));
  };

  // Log an activity entry (user-specific)
  const logActivity = (action: string, details?: string) => {
    if (!userEmail) return;

    const newLog: ActivityLog = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      action,
      timestamp: new Date().toISOString(),
      userEmail: userEmail ?? null,
      details,
    };

    setActivityLogs((prev) => {
      const updated = [newLog, ...prev];
      // Keep only last 100 logs to prevent localStorage bloat
      const trimmed = updated.slice(0, 100);
      const logsKey = getActivityLogsKey(userEmail);
      localStorage.setItem(logsKey, JSON.stringify(trimmed));
      return trimmed;
    });
  };

  // Persist settings (user-specific) - called only when Save button is clicked
  const saveSettings = async () => {
    if (!userEmail) return;

    setSaving(true);
    setSaveStatus(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      persistSettings(settings);
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

  // Clear all logs (user-specific)
  const clearActivityLogs = () => {
    if (!userEmail) return;

    setActivityLogs([]);
    const logsKey = getActivityLogsKey(userEmail);
    localStorage.setItem(logsKey, JSON.stringify([]));
    logActivity("Cleared Activity Logs");
  };

  // Toggle light/dark - NOW SAVES IMMEDIATELY
  const toggleTheme = () => {
    const newTheme: ThemeMode = settings.theme === "light" ? "dark" : "light";
    // Apply immediately to document
    applyTheme(newTheme);
    // Update state with new theme
    const newSettings = { ...settings, theme: newTheme };
    setSettings(newSettings);
    // Save to localStorage immediately
    persistSettings(newSettings);
    // Log the activity
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
