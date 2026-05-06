"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center px-4"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative z-10 w-full max-w-md rounded-2xl border border-[#EDE8E2] bg-white shadow-2xl shadow-black/10"
        style={{
          animation: "modalIn 0.18s cubic-bezier(0.34,1.56,0.64,1) both",
        }}>
        <div className="flex items-start justify-between border-b border-[#F3F0EB] px-6 py-5">
          <div>
            <h2
              className="text-base font-bold text-[#1A1916]"
              style={{ fontFamily: "'Sora', sans-serif" }}>
              {title}
            </h2>
            {subtitle && (
              <p className="mt-0.5 text-xs text-[#B0ADA7]">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#EDE8E2] text-[#B0ADA7] transition-colors hover:border-[#F5C89A] hover:bg-[#FEF0E7] hover:text-[#E8610A]">
            <svg
              width="14"
              height="14"
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
        <div className="px-6 py-5">{children}</div>
      </div>
      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.94) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>,
    document.body,
  );
}
