"use client";

import { useState } from "react";
import { Sun, Moon, Bell, History, Save, Trash2 } from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import { useSettings } from "@/app/hooks/useSettings";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";
import { AlertContainer, useAlert } from "../components/Alert";
import ConfirmationModal from "../components/ConfirmationModal";

export default function SettingsPage() {
  const { user, authLoading } = useAuth();
  const {
    settings,
    activityLogs,
    loading,
    saving,
    toggleTheme,
    saveSettings,
    clearActivityLogs,
    formatTimestamp,
  } = useSettings(user?.email);

  const { toasts, remove, show } = useAlert();
  const [showClearLogsConfirm, setShowClearLogsConfirm] = useState(false);
  const [clearingLogs, setClearingLogs] = useState(false);

  const handleSave = async () => {
    await saveSettings();
    show("success", "Your preferences have been updated.", "Settings saved");
  };

  const handleClearLogs = async () => {
    setClearingLogs(true);
    await clearActivityLogs();
    setClearingLogs(false);
    setShowClearLogsConfirm(false);
    show("success", "Activity logs have been cleared.", "Logs cleared");
  };

  if (authLoading || loading) {
    return (
      <div
        className="flex h-screen overflow-hidden"
        style={{
          backgroundColor: "var(--bg-base)",
          fontFamily: "'DM Sans', sans-serif",
        }}>
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden pt-[53px] md:pt-0">
          <TopBar />
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
                style={{
                  borderColor: "var(--accent)",
                  borderTopColor: "transparent",
                }}
              />
              <p
                className="mt-3 text-sm"
                style={{ color: "var(--text-secondary)" }}>
                Loading settings…
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="flex h-screen overflow-hidden"
        style={{
          backgroundColor: "var(--bg-base)",
          fontFamily: "'DM Sans', sans-serif",
        }}>
        <Sidebar />

        <div className="flex flex-1 flex-col overflow-hidden pt-[53px] md:pt-0">
          <TopBar />

          <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 md:px-8 md:py-7">
            <div className="mx-auto max-w-3xl flex flex-col gap-5 md:gap-7">
              {/* Header */}
              <div>
                <h2
                  className="text-base font-bold sm:text-lg"
                  style={{
                    color: "var(--text-primary)",
                    fontFamily: "'Sora', sans-serif",
                  }}>
                  Settings
                </h2>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Manage your app preferences and account settings
                </p>
              </div>

              <Section
                icon={
                  settings.theme === "light" ?
                    <Sun
                      className="h-4 w-4"
                      style={{ color: "var(--text-secondary)" }}
                    />
                  : <Moon
                      className="h-4 w-4"
                      style={{ color: "var(--text-secondary)" }}
                    />
                }
                title="Appearance">
                <Row
                  label="Dark Mode"
                  description="Switch between light and dark themes">
                  <Toggle
                    active={settings.theme === "dark"}
                    onToggle={toggleTheme}
                  />
                </Row>
              </Section>

              <div
                className="rounded-2xl border overflow-hidden opacity-60"
                style={{
                  backgroundColor: "var(--bg-card)",
                  borderColor: "var(--border)",
                }}>
                <div
                  className="px-5 py-4 border-b flex items-center gap-3"
                  style={{ borderColor: "var(--border)" }}>
                  <Bell
                    className="h-4 w-4"
                    style={{ color: "var(--text-secondary)" }}
                  />
                  <h2
                    className="text-sm font-bold"
                    style={{
                      color: "var(--text-primary)",
                      fontFamily: "'Sora', sans-serif",
                    }}>
                    Notifications
                  </h2>
                  <span
                    className="ml-auto px-2 py-0.5 text-xs font-semibold rounded-lg"
                    style={{
                      backgroundColor: "var(--bg-accent-soft)",
                      color: "var(--accent)",
                    }}>
                    Coming Soon
                  </span>
                </div>
                <div className="px-5 py-4">
                  <Row
                    label="Push Notifications"
                    description="Receive updates and alerts (feature coming soon)">
                    <Toggle active={false} onToggle={() => {}} disabled />
                  </Row>
                </div>
              </div>

              <Section
                icon={
                  <History
                    className="h-4 w-4"
                    style={{ color: "var(--text-secondary)" }}
                  />
                }
                title="Activity Logs"
                action={
                  activityLogs.length > 0 ?
                    <button
                      onClick={() => setShowClearLogsConfirm(true)}
                      className="flex items-center gap-1.5 text-xs font-semibold transition-colors"
                      style={{ color: "var(--accent)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = "var(--accent-hover)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = "var(--accent)";
                      }}>
                      <Trash2 className="h-3.5 w-3.5" />
                      Clear All
                    </button>
                  : null
                }>
                {activityLogs.length === 0 ?
                  <div className="py-10 text-center">
                    <History
                      className="h-10 w-10 mx-auto mb-3"
                      style={{ color: "var(--border-dashed)" }}
                    />
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--text-secondary)" }}>
                      No activity yet
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--text-muted)" }}>
                      Your actions will appear here as you use the app
                    </p>
                  </div>
                : <div
                    className="max-h-80 overflow-y-auto divide-y"
                    style={{ divideColor: "var(--divide)" }}>
                    {activityLogs.map((log) => (
                      <div
                        key={log.id}
                        className="py-3 flex items-start justify-between gap-4 -mx-5 px-5 transition-colors"
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor =
                            "var(--bg-base)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = "transparent";
                        }}>
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-sm font-medium truncate"
                            style={{ color: "var(--text-primary)" }}>
                            {log.action}
                          </p>
                          {log.details && (
                            <p
                              className="text-xs mt-0.5 truncate"
                              style={{ color: "var(--text-secondary)" }}>
                              {log.details}
                            </p>
                          )}
                          {log.userEmail && (
                            <p
                              className="text-xs mt-0.5"
                              style={{ color: "var(--text-muted)" }}>
                              {log.userEmail}
                            </p>
                          )}
                        </div>
                        <p
                          className="text-xs whitespace-nowrap shrink-0"
                          style={{ color: "var(--text-muted)" }}>
                          {formatTimestamp(log.timestamp)}
                        </p>
                      </div>
                    ))}
                  </div>
                }
              </Section>

              <div className="flex justify-end pb-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-xl transition-colors active:scale-[0.987] disabled:opacity-60"
                  style={{
                    backgroundColor: "var(--accent)",
                  }}
                  onMouseEnter={(e) => {
                    if (!saving) {
                      e.currentTarget.style.backgroundColor =
                        "var(--accent-hover)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!saving) {
                      e.currentTarget.style.backgroundColor = "var(--accent)";
                    }
                  }}>
                  {saving ?
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Saving…
                    </>
                  : <>
                      <Save className="h-4 w-4" />
                      Save Settings
                    </>
                  }
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* ── Clear Logs Confirmation Modal ── */}
      <ConfirmationModal
        isOpen={showClearLogsConfirm}
        title="Clear Activity Logs?"
        message="This action cannot be undone. All activity logs will be permanently deleted."
        confirmLabel="Clear All"
        cancelLabel="Cancel"
        loading={clearingLogs}
        onConfirm={handleClearLogs}
        onCancel={() => setShowClearLogsConfirm(false)}
      />

      <AlertContainer toasts={toasts} onRemove={remove} position="top-center" />
    </>
  );
}

function Section({
  icon,
  title,
  action,
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      className="rounded-2xl border overflow-hidden"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border)",
      }}>
      <div
        className="px-5 py-4 border-b flex items-center gap-2"
        style={{ borderColor: "var(--border)" }}>
        {icon}
        <h2
          className="text-sm font-bold"
          style={{
            color: "var(--text-primary)",
            fontFamily: "'Sora', sans-serif",
          }}>
          {title}
        </h2>
        {action && <div className="ml-auto">{action}</div>}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function Row({
  label,
  description,
  children,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p
          className="text-sm font-medium"
          style={{ color: "var(--text-primary)" }}>
          {label}
        </p>
        {description && (
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

function Toggle({
  active,
  onToggle,
  disabled = false,
}: {
  active: boolean;
  onToggle: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      style={{
        backgroundColor: active ? "var(--accent)" : "var(--border)",
      }}>
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
          active ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
