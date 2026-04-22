"use client";

import { useEffect } from "react";
import { AuthStatus } from "@/app/hooks/useAuth";

type Props = {
  status: AuthStatus;
  onClose: () => void;
};

export default function AuthAlert({ status, onClose }: Props) {
  useEffect(() => {
    if (!status) return;
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [status, onClose]);

  if (!status) return null;

  const isSuccess = status.type === "success";

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 text-sm ${
        isSuccess ?
          "border-green-200 bg-green-50 text-green-800"
        : "border-red-200 bg-red-50 text-red-800"
      }`}>
      <span className="mt-0.5 shrink-0">
        {isSuccess ?
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        : <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        }
      </span>

      <p className="flex-1">{status.message}</p>

      <button
        onClick={onClose}
        aria-label="Dismiss"
        className="shrink-0 opacity-50 hover:opacity-100 transition-opacity">
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}
