import React, { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

interface ProjectSummaryModalProps {
  isOpen: boolean;
  projectTitle: string;
  content: string;
  copyState: "idle" | "copied";
  onClose: () => void;
  onCopy: () => void;
  onDownload: () => void;
}

export default function ProjectSummaryModal({
  isOpen,
  projectTitle,
  content,
  copyState,
  onClose,
  onCopy,
  onDownload,
}: ProjectSummaryModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-2xl shadow-black/20 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)] shrink-0">
          <div className="flex items-center gap-3">
            <h2
              className="text-lg font-bold text-[var(--text-primary)]"
              style={{ fontFamily: "'Sora', sans-serif" }}>
              Project Summary
            </h2>
            <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--text-muted)]">
              {projectTitle}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {/* Copy button */}
            <button
              onClick={onCopy}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--bg-accent-soft)] hover:text-[var(--accent)]">
              {copyState === "copied" ?
                <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Copied!
                </>
              : <>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy
                </>
              }
            </button>

            {/* Download button */}
            <button
              onClick={onDownload}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--bg-accent-soft)] hover:text-[var(--accent)]">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Download
            </button>

            {/* Close button */}
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]">
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
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-lg font-semibold text-[var(--text-primary)] mt-6 mb-3">
                  {children}
                </h2>
              ),
              p: ({ children }) => (
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-3">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-1 mb-3">
                  {children}
                </ul>
              ),
              li: ({ children }) => (
                <li className="text-sm text-[var(--text-secondary)]">
                  {children}
                </li>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-3">
                  <table className="min-w-full border-collapse border border-[var(--border)] rounded-lg">
                    {children}
                  </table>
                </div>
              ),
              th: ({ children }) => (
                <th className="border border-[var(--border)] px-3 py-2 text-left text-xs font-bold text-[var(--text-primary)] bg-[var(--bg-base)]">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-[var(--border)] px-3 py-2 text-sm text-[var(--text-secondary)]">
                  {children}
                </td>
              ),
              hr: () => <hr className="my-4 border-[var(--border)]" />,
              em: ({ children }) => (
                <em className="text-xs text-[var(--text-muted)] not-italic">
                  {children}
                </em>
              ),
            }}>
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
