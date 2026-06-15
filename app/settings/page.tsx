"use client";

import { useState } from "react";
import {
  Sun,
  Moon,
  Bell,
  History,
  Save,
  Trash2,
  Lock,
  UserCircle,
} from "lucide-react";
import { useAuth } from "@/app/hooks/useAuth";
import { useSettings } from "@/app/hooks/useSettings";
import { useNotificationPermission } from "@/app/hooks/useNotificationPermission";
import { useAccountSettings } from "@/app/hooks/useAccountSettings";
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

  const {
    notificationsEnabled,
    loading: notificationLoading,
    permissionState,
    toggleNotifications,
  } = useNotificationPermission();

  const account = useAccountSettings(user?.email);

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

  const handleToggleNotifications = async () => {
    const success = await toggleNotifications();
    if (success) {
      show(
        "success",
        "Notifications enabled! You'll receive daily task reminders.",
        "Notifications On",
      );
    } else if (permissionState === "denied") {
      show(
        "error",
        "Notifications are blocked. Please check your browser settings to enable them.",
        "Permission Denied",
      );
    } else if (!user) {
      show(
        "error",
        "Please login first to enable notifications.",
        "Login Required",
      );
    }
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

              {/* ── Account Section ── */}
              <Section
                icon={
                  <UserCircle
                    className="h-4 w-4"
                    style={{ color: "var(--text-secondary)" }}
                  />
                }
                title="Account">
                {/* Email */}
                <div className="flex flex-col gap-1.5 mb-5">
                  <p
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}>
                    Email address
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={account.newEmail}
                      onChange={(e) => account.setNewEmail(e.target.value)}
                      className="flex-1 h-9 px-3 text-sm rounded-xl border outline-none"
                      style={{
                        backgroundColor: "var(--bg-base)",
                        borderColor:
                          account.emailError ? "var(--error)" : "var(--border)",
                        color: "var(--text-primary)",
                      }}
                    />
                    <button
                      onClick={async () => {
                        const ok = await account.updateEmail();
                        if (ok)
                          show(
                            "success",
                            "Email updated successfully.",
                            "Done",
                          );
                      }}
                      disabled={account.emailSaving}
                      className="h-9 px-4 text-sm font-semibold rounded-xl text-white disabled:opacity-60 transition-colors"
                      style={{ backgroundColor: "var(--accent)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--accent-hover)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--accent)";
                      }}>
                      {account.emailSaving ?
                        <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      : "Update"}
                    </button>
                  </div>
                  {account.emailError && (
                    <p className="text-xs" style={{ color: "var(--error)" }}>
                      {account.emailError}
                    </p>
                  )}
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    A confirmation link will be sent to your new address.
                  </p>
                </div>

                {/* Divider */}
                <div
                  className="border-t mb-5"
                  style={{ borderColor: "var(--border)" }}
                />

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <p
                    className="text-sm font-medium mb-1"
                    style={{ color: "var(--text-primary)" }}>
                    Change password
                  </p>
                  <input
                    type="password"
                    placeholder="Current password"
                    value={account.currentPassword}
                    onChange={(e) => account.setCurrentPassword(e.target.value)}
                    className="h-9 px-3 text-sm rounded-xl border outline-none"
                    style={{
                      backgroundColor: "var(--bg-base)",
                      borderColor:
                        account.passwordError ? "var(--error)" : (
                          "var(--border)"
                        ),
                      color: "var(--text-primary)",
                    }}
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    value={account.newPassword}
                    onChange={(e) => account.setNewPassword(e.target.value)}
                    className="h-9 px-3 text-sm rounded-xl border outline-none"
                    style={{
                      backgroundColor: "var(--bg-base)",
                      borderColor:
                        account.passwordError ? "var(--error)" : (
                          "var(--border)"
                        ),
                      color: "var(--text-primary)",
                    }}
                  />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={account.confirmPassword}
                    onChange={(e) => account.setConfirmPassword(e.target.value)}
                    className="h-9 px-3 text-sm rounded-xl border outline-none"
                    style={{
                      backgroundColor: "var(--bg-base)",
                      borderColor:
                        account.passwordError ? "var(--error)" : (
                          "var(--border)"
                        ),
                      color: "var(--text-primary)",
                    }}
                  />
                  {account.passwordError && (
                    <p className="text-xs" style={{ color: "var(--error)" }}>
                      {account.passwordError}
                    </p>
                  )}
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Minimum 8 characters.
                  </p>
                  <div className="flex justify-end mt-1">
                    <button
                      onClick={async () => {
                        const ok = await account.updatePassword();
                        if (ok)
                          show(
                            "success",
                            "Password changed successfully.",
                            "Done",
                          );
                      }}
                      disabled={account.passwordSaving}
                      className="flex items-center gap-2 h-9 px-4 text-sm font-semibold rounded-xl text-white disabled:opacity-60 transition-colors"
                      style={{ backgroundColor: "var(--accent)" }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--accent-hover)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "var(--accent)";
                      }}>
                      {account.passwordSaving ?
                        <>
                          <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          Saving…
                        </>
                      : <>
                          <Lock className="h-4 w-4" />
                          Update password
                        </>
                      }
                    </button>
                  </div>
                </div>
              </Section>

              {/* ── Appearance Section ── */}
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

              {/* ── Notifications Section ── */}
              <Section
                icon={
                  <Bell
                    className="h-4 w-4"
                    style={{ color: "var(--text-secondary)" }}
                  />
                }
                title="Notifications">
                <div className="space-y-4">
                  <Row
                    label="Push Notifications"
                    description="Receive daily task reminders and project updates">
                    <div className="flex items-center gap-3">
                      {permissionState === "denied" && (
                        <span
                          className="text-xs px-2 py-1 rounded-lg"
                          style={{
                            backgroundColor: "var(--bg-error)",
                            color: "var(--error)",
                          }}>
                          Blocked
                        </span>
                      )}
                      <Toggle
                        active={notificationsEnabled}
                        onToggle={handleToggleNotifications}
                        disabled={notificationLoading}
                        loading={notificationLoading}
                      />
                    </div>
                  </Row>

                  {permissionState === "denied" && (
                    <div
                      className="mt-3 p-3 rounded-lg text-xs"
                      style={{
                        backgroundColor: "var(--bg-error-soft)",
                        color: "var(--error)",
                        border: "1px solid var(--error-border)",
                      }}>
                      <div className="flex items-start gap-2">
                        <Bell className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium mb-0.5">
                            Notifications are blocked
                          </p>
                          <p className="opacity-90">
                            Please check your browser settings and allow
                            notifications for this site, then toggle the switch
                            again.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {notificationsEnabled && (
                    <div
                      className="mt-3 p-3 rounded-lg text-xs"
                      style={{
                        backgroundColor: "var(--bg-success-soft)",
                        color: "var(--success)",
                        border: "1px solid var(--success-border)",
                      }}>
                      <div className="flex items-start gap-2">
                        <Bell className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium mb-0.5">
                            Notifications enabled ✓
                          </p>
                          <p className="opacity-90">
                            You'll receive daily reminders for pending tasks in
                            your projects.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Section>

              {/* ── Activity Logs Section ── */}
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

              {/* ── Save Button ── */}
              <div className="flex justify-end pb-4">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 text-white text-sm font-semibold rounded-xl transition-colors active:scale-[0.987] disabled:opacity-60"
                  style={{ backgroundColor: "var(--accent)" }}
                  onMouseEnter={(e) => {
                    if (!saving)
                      e.currentTarget.style.backgroundColor =
                        "var(--accent-hover)";
                  }}
                  onMouseLeave={(e) => {
                    if (!saving)
                      e.currentTarget.style.backgroundColor = "var(--accent)";
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

// ── Helper Components ──

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
  loading = false,
}: {
  active: boolean;
  onToggle: () => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <button
      onClick={onToggle}
      disabled={disabled || loading}
      className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
      style={{ backgroundColor: active ? "var(--accent)" : "var(--border)" }}>
      {loading ?
        <span className="absolute inset-0 flex items-center justify-center">
          <div className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
        </span>
      : <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
            active ? "translate-x-5" : "translate-x-0"
          }`}
        />
      }
    </button>
  );
}
