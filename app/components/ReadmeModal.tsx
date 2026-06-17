"use client";

import React, { Fragment, useEffect } from "react";

interface ReadmeModalProps {
  isOpen: boolean;
  projectTitle: string;
  content: string;
  copyState: "idle" | "copied" | "error";
  onClose: () => void;
  onCopy: () => void;
  onDownload: () => void;
}

/**
 * Minimal renderer for the specific markdown shapes our own README
 * template produces (headings, bullets, bold labels, code fences, hr,
 * italics, links, paragraphs). Not a general-purpose markdown parser —
 * intentionally scoped to what buildReadmeMarkdown() emits.
 */
function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Split on **bold** segments while keeping the rest as plain text.
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  parts.forEach((part, i) => {
    if (!part) return;
    if (part.startsWith("**") && part.endsWith("**")) {
      nodes.push(
        <strong
          key={`${keyPrefix}-b-${i}`}
          style={{ color: "var(--text-primary)" }}>
          {part.slice(2, -2)}
        </strong>,
      );
    } else if (part.startsWith("_") && part.endsWith("_") && part.length > 1) {
      nodes.push(
        <em key={`${keyPrefix}-i-${i}`} style={{ color: "var(--text-muted)" }}>
          {part.slice(1, -1)}
        </em>,
      );
    } else {
      nodes.push(<Fragment key={`${keyPrefix}-t-${i}`}>{part}</Fragment>);
    }
  });
  return nodes;
}

function renderMarkdown(markdown: string): React.ReactNode {
  const lines = markdown.split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let listBuffer: string[] = [];

  const flushList = (key: string) => {
    if (listBuffer.length === 0) return;
    blocks.push(
      <ul key={key} className="my-2 ml-4 flex flex-col gap-1">
        {listBuffer.map((item, idx) => (
          <li
            key={`${key}-${idx}`}
            className="list-disc text-sm leading-relaxed"
            style={{ color: "var(--text-secondary)" }}>
            {renderInline(item, `${key}-${idx}`)}
          </li>
        ))}
      </ul>,
    );
    listBuffer = [];
  };

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      flushList(`list-${i}`);
      blocks.push(
        <pre
          key={`code-${i}`}
          className="my-2 overflow-x-auto rounded-xl p-3 text-[11px] leading-relaxed"
          style={{
            backgroundColor: "var(--bg-base)",
            color: "var(--text-secondary)",
          }}>
          <code>{codeLines.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    if (line.startsWith("# ")) {
      flushList(`list-${i}`);
      blocks.push(
        <h1
          key={`h1-${i}`}
          className="text-lg font-bold"
          style={{
            fontFamily: "'Sora', sans-serif",
            color: "var(--text-primary)",
          }}>
          {renderInline(line.slice(2), `h1-${i}`)}
        </h1>,
      );
      i++;
      continue;
    }

    if (line.startsWith("## ")) {
      flushList(`list-${i}`);
      blocks.push(
        <h2
          key={`h2-${i}`}
          className="mt-3 text-sm font-bold uppercase tracking-wide"
          style={{ color: "#E8610A" }}>
          {renderInline(line.slice(3), `h2-${i}`)}
        </h2>,
      );
      i++;
      continue;
    }

    if (line.startsWith("- ")) {
      listBuffer.push(line.slice(2));
      i++;
      continue;
    }

    if (line.trim() === "---") {
      flushList(`list-${i}`);
      blocks.push(
        <hr
          key={`hr-${i}`}
          className="my-3"
          style={{ borderColor: "var(--divide)" }}
        />,
      );
      i++;
      continue;
    }

    if (line.trim() === "") {
      flushList(`list-${i}`);
      i++;
      continue;
    }

    flushList(`list-${i}`);
    blocks.push(
      <p
        key={`p-${i}`}
        className="text-sm leading-relaxed"
        style={{ color: "var(--text-secondary)" }}>
        {renderInline(line, `p-${i}`)}
      </p>,
    );
    i++;
  }

  flushList("list-final");
  return blocks;
}

export default function ReadmeModal({
  isOpen,
  projectTitle,
  content,
  copyState,
  onClose,
  onCopy,
  onDownload,
}: ReadmeModalProps) {
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative flex w-full max-w-lg flex-col rounded-2xl border shadow-2xl"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border)",
          maxHeight: "85vh",
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
              README.md
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

        {/* Preview body */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex flex-col gap-1">{renderMarkdown(content)}</div>
        </div>

        {/* Footer actions */}
        <div
          className="flex items-center justify-end gap-2 border-t px-5 py-3"
          style={{ borderColor: "var(--divide)" }}>
          <button
            type="button"
            onClick={onCopy}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-colors"
            style={{
              backgroundColor: "var(--bg-base)",
              color:
                copyState === "copied" ? "#16A34A"
                : copyState === "error" ? "#DC2626"
                : "var(--text-secondary)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--bg-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--bg-base)")
            }>
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            {copyState === "copied" ?
              "Copied!"
            : copyState === "error" ?
              "Couldn't copy"
            : "Copy"}
          </button>
          <button
            type="button"
            onClick={onDownload}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold text-white transition-colors"
            style={{ backgroundColor: "#E8610A" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#D15508")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#E8610A")
            }>
            <svg
              width="13"
              height="13"
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
        </div>
      </div>
    </div>
  );
}
