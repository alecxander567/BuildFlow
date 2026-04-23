"use client";

import { useEffect } from "react";

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
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !loading) onCancel();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, loading, onCancel]);

  if (!isOpen) return null;

  const confirmClasses =
    confirmVariant === "danger" ?
      "bg-[#DC2626] hover:bg-[#B91C1C]"
    : "bg-[#E8610A] hover:bg-[#D15508]";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4"
      onClick={() => {
        if (!loading) onCancel();
      }}>
      <div
        className="w-full max-w-md rounded-2xl border border-[#EDE8E2] bg-white p-5"
        onClick={(e) => e.stopPropagation()}>
        <h3
          className="text-base font-bold text-[#1A1916]"
          style={{ fontFamily: "'Sora', sans-serif" }}>
          {title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-[#72706A]">{message}</p>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 rounded-xl border border-[#E8E4DE] bg-white py-2.5 text-sm font-medium text-[#72706A] transition-colors hover:border-[#F5C89A] hover:bg-[#FEF0E7] hover:text-[#E8610A] disabled:opacity-60">
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60 ${confirmClasses}`}>
            {loading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
