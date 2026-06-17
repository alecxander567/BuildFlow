"use client";

import React, { useEffect, useState } from "react";

interface ReadmeFormModalProps {
  isOpen: boolean;
  projectTitle: string;
  onClose: () => void;
  onGenerate: (techStack: string[]) => void;
}

export default function ReadmeFormModal({
  isOpen,
  projectTitle,
  onClose,
  onGenerate,
}: ReadmeFormModalProps) {
  const [techStack, setTechStack] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTechStack([]);
      setInputValue("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const addTech = (raw: string) => {
    const value = raw.trim();
    if (!value) return;
    if (techStack.some((t) => t.toLowerCase() === value.toLowerCase())) {
      setInputValue("");
      return;
    }
    setTechStack((prev) => [...prev, value]);
    setInputValue("");
  };

  const removeTech = (value: string) => {
    setTechStack((prev) => prev.filter((t) => t !== value));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTech(inputValue);
    } else if (
      e.key === "Backspace" &&
      inputValue === "" &&
      techStack.length > 0
    ) {
      removeTech(techStack[techStack.length - 1]);
    }
  };

  const handleSubmit = () => {
    // Flush whatever's still sitting in the input box as a final chip.
    const finalStack =
      inputValue.trim() ?
        [...techStack, inputValue.trim()].filter(
          (t, i, arr) =>
            arr.findIndex((x) => x.toLowerCase() === t.toLowerCase()) === i,
        )
      : techStack;
    onGenerate(finalStack);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md rounded-2xl border shadow-2xl"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border)",
        }}
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div
          className="flex items-center justify-between rounded-t-2xl px-5 py-4"
          style={{ backgroundColor: "var(--bg-base)" }}>
          <div>
            <p
              className="text-sm font-bold"
              style={{ color: "var(--text-primary)" }}>
              Generate README
            </p>
            <p
              className="mt-0.5 truncate text-xs"
              style={{ color: "var(--text-muted)" }}>
              {projectTitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--bg-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }>
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

        {/* Body */}
        <div className="px-5 py-4">
          <label
            className="text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}>
            Tech stack
          </label>
          <p
            className="mt-1 text-xs"
            style={{ color: "var(--text-secondary)" }}>
            Type a technology and press Enter or comma to add it.
          </p>

          <div
            className="mt-2.5 flex min-h-[44px] flex-wrap items-center gap-1.5 rounded-xl border px-2.5 py-2"
            style={{
              backgroundColor: "var(--bg-base)",
              borderColor: "var(--border)",
            }}>
            {techStack.map((tech) => (
              <span
                key={tech}
                className="flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium"
                style={{
                  backgroundColor: "#FEF0E7",
                  color: "#E8610A",
                }}>
                {tech}
                <button
                  type="button"
                  onClick={() => removeTech(tech)}
                  aria-label={`Remove ${tech}`}
                  className="flex h-3.5 w-3.5 items-center justify-center rounded-full transition-colors hover:bg-black/10">
                  <svg
                    width="8"
                    height="8"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </span>
            ))}
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                techStack.length === 0 ? "e.g. React, Tailwind, Supabase" : ""
              }
              className="min-w-[100px] flex-1 bg-transparent text-xs outline-none"
              style={{ color: "var(--text-primary)" }}
              autoFocus
            />
          </div>

          {techStack.length === 0 && inputValue.trim() === "" && (
            <p
              className="mt-2 text-[11px] italic"
              style={{ color: "var(--text-muted)" }}>
              You can also generate without a tech stack — it'll be marked as
              not specified yet.
            </p>
          )}
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-end gap-2 border-t px-5 py-3"
          style={{ borderColor: "var(--divide)" }}>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-semibold transition-colors"
            style={{
              backgroundColor: "var(--bg-base)",
              color: "var(--text-secondary)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--bg-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--bg-base)")
            }>
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-white transition-colors"
            style={{ backgroundColor: "#E8610A" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#D15508")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#E8610A")
            }>
            Generate README
          </button>
        </div>
      </div>
    </div>
  );
}
