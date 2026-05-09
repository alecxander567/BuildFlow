"use client";

import { useEffect, useRef } from "react";
import LoadingSpinner from "./LoadingSpinner";

type ConfirmationModalProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "danger" | "primary";
  loading?: boolean;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
};

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "primary",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, loading, onCancel]);

  // Animate in on open
  useEffect(() => {
    if (!isOpen || !panelRef.current) return;
    const el = panelRef.current;
    el.animate(
      [
        { opacity: 0, transform: "translateY(10px) scale(0.97)" },
        { opacity: 1, transform: "translateY(0) scale(1)" },
      ],
      {
        duration: 200,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "forwards",
      },
    );
  }, [isOpen]);

  if (!isOpen) return null;

  const isDanger = confirmVariant === "danger";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      style={{
        background: "rgba(0, 0, 0, 0.45)",
        backdropFilter: "blur(4px)",
      }}
      onClick={() => {
        if (!loading) onCancel();
      }}>
      <div
        ref={panelRef}
        className="w-full max-w-sm overflow-hidden rounded-2xl border shadow-xl"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-card)",
          fontFamily: "'DM Sans', sans-serif",
          opacity: 0,
        }}
        onClick={(e) => e.stopPropagation()}>
        {/* Top accent strip - always orange now */}
        <div
          className="h-1 w-full"
          style={{
            background: "linear-gradient(90deg, var(--accent), #F5A623)",
          }}
        />

        <div className="p-6">
          {/* Icon + title row */}
          <div className="flex items-start gap-3.5">
            {/* Icon badge - always orange now */}
            <div
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: "var(--bg-accent-soft)",
              }}>
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className="text-[15px] font-bold leading-snug"
                style={{
                  color: "var(--text-primary)",
                  fontFamily: "'Sora', sans-serif",
                }}>
                {title}
              </h3>
              <p
                className="mt-1.5 text-[13px] leading-relaxed"
                style={{ color: "var(--text-secondary)" }}>
                {message}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div
            className="mt-5 border-t"
            style={{ borderColor: "var(--divide)" }}
          />

          {/* Actions */}
          <div className="mt-4 flex gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 rounded-xl border py-2.5 text-[13px] font-medium transition-all disabled:pointer-events-none disabled:opacity-50"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-secondary)",
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.backgroundColor =
                    "var(--bg-accent-soft)";
                  e.currentTarget.style.color = "var(--accent)";
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.backgroundColor = "var(--bg-card)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }
              }}>
              {cancelLabel}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="relative flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold text-white transition-all disabled:pointer-events-none disabled:opacity-60"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent), var(--accent-hover))",
                boxShadow: "0 2px 8px rgba(232,97,10,0.25)",
              }}>
              {loading ?
                <LoadingSpinner variant="spinner" size="sm" />
              : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
