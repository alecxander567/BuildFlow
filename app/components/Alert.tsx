"use client";

import { useEffect, useState, useCallback } from "react";

export type AlertType = "success" | "error" | "warning" | "info";

export interface AlertProps {
  type: AlertType;
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
}

const config: Record<
  AlertType,
  {
    bg: string;
    border: string;
    icon: string;
    iconBg: string;
    title: string;
    bar: string;
  }
> = {
  success: {
    bg: "bg-white",
    border: "border-[#F5C89A]",
    icon: "text-[#E8610A]",
    iconBg: "bg-[#FEF0E7]",
    title: "text-[#E8610A]",
    bar: "bg-[#E8610A]",
  },
  error: {
    bg: "bg-white",
    border: "border-[#FECACA]",
    icon: "text-[#DC2626]",
    iconBg: "bg-[#FEF2F2]",
    title: "text-[#B91C1C]",
    bar: "bg-[#DC2626]",
  },
  warning: {
    bg: "bg-white",
    border: "border-[#FDE68A]",
    icon: "text-[#D97706]",
    iconBg: "bg-[#FFFBEB]",
    title: "text-[#B45309]",
    bar: "bg-[#D97706]",
  },
  info: {
    bg: "bg-white",
    border: "border-[#BAE6FD]",
    icon: "text-[#0284C7]",
    iconBg: "bg-[#F0F9FF]",
    title: "text-[#0369A1]",
    bar: "bg-[#0284C7]",
  },
};

const icons: Record<AlertType, React.ReactElement> = {
  success: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  error: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  warning: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="8" />
      <line x1="12" y1="12" x2="12" y2="16" />
    </svg>
  ),
};

const defaultTitles: Record<AlertType, string> = {
  success: "Success",
  error: "Something went wrong",
  warning: "Heads up",
  info: "Just so you know",
};

export function Alert({
  type,
  title,
  message,
  duration = 4000,
  onClose,
}: AlertProps) {
  const [visible, setVisible] = useState(false);
  const [gone, setGone] = useState(false);
  const c = config[type];

  const dismiss = useCallback(() => {
    setVisible(false);
    setTimeout(() => {
      setGone(true);
      onClose?.();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 16);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!duration) return;
    const t = setTimeout(dismiss, duration);
    return () => clearTimeout(t);
  }, [duration, dismiss]);

  if (gone) return null;

  return (
    <div
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      className={`relative flex w-full max-w-sm overflow-hidden rounded-2xl border shadow-lg shadow-black/5 transition-all duration-300 ${c.bg} ${c.border} ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
      }`}>
      <div className={`w-1 shrink-0 ${c.bar}`} />

      <div className="flex flex-1 items-start gap-3 px-4 py-3.5">
        <div
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl ${c.iconBg} ${c.icon}`}>
          {icons[type]}
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={`text-xs font-bold ${c.title}`}
            style={{ fontFamily: "'Sora', sans-serif" }}>
            {title ?? defaultTitles[type]}
          </p>
          <p className="mt-0.5 text-xs leading-relaxed text-[#72706A]">
            {message}
          </p>
        </div>

        <button
          onClick={dismiss}
          className="mt-0.5 shrink-0 rounded-lg p-1 text-[#B0ADA7] transition-colors hover:bg-[#F2EDE7] hover:text-[#72706A]">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export interface ToastItem {
  id: string;
  type: AlertType;
  title?: string;
  message: string;
  duration?: number;
}

interface AlertContainerProps {
  toasts: ToastItem[];
  onRemove: (id: string) => void;
  position?:
    | "top-right"
    | "top-left"
    | "bottom-right"
    | "bottom-left"
    | "top-center"
    | "bottom-center";
}

const positionClasses: Record<
  NonNullable<AlertContainerProps["position"]>,
  string
> = {
  "top-right": "top-5 right-5 items-end",
  "top-left": "top-5 left-5 items-start",
  "bottom-right": "bottom-5 right-5 items-end",
  "bottom-left": "bottom-5 left-5 items-start",
  "top-center": "top-5 left-1/2 -translate-x-1/2 items-center",
  "bottom-center": "bottom-5 left-1/2 -translate-x-1/2 items-center",
};

export function AlertContainer({
  toasts,
  onRemove,
  position = "top-center",
}: AlertContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className={`fixed z-[9999] flex flex-col gap-2.5 ${positionClasses[position]}`}>
      {toasts.map((toast) => (
        <Alert
          key={toast.id}
          type={toast.type}
          title={toast.title}
          message={toast.message}
          duration={toast.duration}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  );
}

export function useAlert() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const show = useCallback(
    (type: AlertType, message: string, title?: string, duration?: number) => {
      const id = `${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, type, message, title, duration }]);
    },
    [],
  );

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback(
    (message: string, title?: string) => show("success", message, title),
    [show],
  );
  const error = useCallback(
    (message: string, title?: string) => show("error", message, title),
    [show],
  );
  const warning = useCallback(
    (message: string, title?: string) => show("warning", message, title),
    [show],
  );
  const info = useCallback(
    (message: string, title?: string) => show("info", message, title),
    [show],
  );

  return { toasts, show, remove, success, error, warning, info };
}
