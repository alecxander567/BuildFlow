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
  confirmVariant = "danger",
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
        background: "rgba(26, 25, 22, 0.45)",
        backdropFilter: "blur(4px)",
      }}
      onClick={() => {
        if (!loading) onCancel();
      }}>
      <div
        ref={panelRef}
        className="w-full max-w-sm overflow-hidden rounded-2xl border border-[#EDE8E2] bg-[#FDFCFB] shadow-xl"
        style={{ fontFamily: "'DM Sans', sans-serif", opacity: 0 }}
        onClick={(e) => e.stopPropagation()}>
        {/* Top accent strip */}
        <div
          className="h-1 w-full"
          style={{
            background:
              isDanger ?
                "linear-gradient(90deg, #DC2626, #F87171)"
              : "linear-gradient(90deg, #E8610A, #F5A623)",
          }}
        />

        <div className="p-6">
          {/* Icon + title row */}
          <div className="flex items-start gap-3.5">
            {/* Icon badge */}
            <div
              className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: isDanger ? "#FEF2F2" : "#FEF0E7",
              }}>
              {
                isDanger ?
                  // Trash / warning icon for danger
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#DC2626"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                  // Check / action icon for primary
                : <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#E8610A"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>

              }
            </div>

            <div className="flex-1 min-w-0">
              <h3
                className="text-[15px] font-bold leading-snug text-[#1A1916]"
                style={{ fontFamily: "'Sora', sans-serif" }}>
                {title}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#72706A]">
                {message}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="mt-5 border-t border-[#F0EBE5]" />

          {/* Actions */}
          <div className="mt-4 flex gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 rounded-xl border border-[#E8E4DE] bg-white py-2.5 text-[13px] font-medium text-[#72706A] transition-all hover:border-[#F5C89A] hover:bg-[#FEF0E7] hover:text-[#E8610A] disabled:pointer-events-none disabled:opacity-50">
              {cancelLabel}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={loading}
              className="relative flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold text-white transition-all disabled:pointer-events-none disabled:opacity-60"
              style={{
                background:
                  isDanger ?
                    "linear-gradient(135deg, #DC2626, #C41E1E)"
                  : "linear-gradient(135deg, #E8610A, #D15508)",
                boxShadow:
                  isDanger ?
                    "0 2px 8px rgba(220,38,38,0.25)"
                  : "0 2px 8px rgba(232,97,10,0.25)",
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
