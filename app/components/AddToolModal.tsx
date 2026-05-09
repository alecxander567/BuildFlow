"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

type ToolsMap = Record<string, string[]>;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  activeCategory: string | null;
  catalog: ToolsMap;
  newToolName: string;
  onToolNameChange: (name: string) => void;
  toolError: string;
  onToolErrorChange: (error: string) => void;
  onAdd: () => void;
};

const TOOL_SUGGESTIONS: Record<string, string[]> = {
  Software: [
    "Python",
    "MATLAB",
    "R",
    "JavaScript",
    "Excel",
    "SPSS",
    "AutoCAD",
    "SolidWorks",
  ],
  Hardware: [
    "Arduino",
    "Raspberry Pi",
    "Oscilloscope",
    "Multimeter",
    "3D Printer",
    "CNC Machine",
    "Soldering Station",
  ],
  Research: [
    "Google Scholar",
    "Zotero",
    "Mendeley",
    "EndNote",
    "JSTOR",
    "PubMed",
    "ResearchGate",
    "Overleaf",
  ],
  Design: [
    "Figma",
    "AutoCAD",
    "Adobe Illustrator",
    "Blender",
    "SketchUp",
    "Canva",
    "Photoshop",
    "InDesign",
  ],
  Writing: [
    "Microsoft Word",
    "Google Docs",
    "LaTeX",
    "Notion",
    "Grammarly",
    "Scrivener",
    "Obsidian",
  ],
  "Data & Analytics": [
    "Excel",
    "Google Sheets",
    "Tableau",
    "Power BI",
    "SPSS",
    "R",
    "Python",
    "MATLAB",
  ],
  Communication: [
    "Slack",
    "Microsoft Teams",
    "Zoom",
    "Google Meet",
    "Email",
    "Trello",
    "Notion",
    "Discord",
  ],
  Management: [
    "Trello",
    "Jira",
    "Asana",
    "Notion",
    "Microsoft Project",
    "ClickUp",
    "Monday.com",
    "Linear",
  ],
  Laboratory: [
    "Microscope",
    "Spectrophotometer",
    "PCR Machine",
    "Centrifuge",
    "pH Meter",
    "Autoclave",
    "Pipettes",
  ],
  "Field Work": [
    "GPS Device",
    "Drone",
    "Survey Equipment",
    "Camera",
    "Field Notebook",
    "Soil Kit",
    "Weather Station",
  ],
  _default: [
    "Notion",
    "Google Drive",
    "Microsoft Office",
    "Zoom",
    "Slack",
    "Trello",
    "Email",
    "Canva",
  ],
};

export function AddToolModal({
  isOpen,
  onClose,
  activeCategory,
  catalog,
  newToolName,
  onToolNameChange,
  toolError,
  onToolErrorChange,
  onAdd,
}: Props) {
  const toolInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => toolInputRef.current?.focus(), 50);
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
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const suggestions =
    activeCategory ?
      (TOOL_SUGGESTIONS[activeCategory] ?? TOOL_SUGGESTIONS["_default"])
    : [];

  return createPortal(
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center px-4"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative z-10 w-full max-w-md rounded-2xl border shadow-2xl"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-card)",
          animation: "modalIn 0.18s cubic-bezier(0.34,1.56,0.64,1) both",
        }}>
        {/* Header */}
        <div
          className="flex items-start justify-between border-b px-6 py-5"
          style={{ borderColor: "var(--divide)" }}>
          <div>
            <h2
              className="text-base font-bold"
              style={{
                color: "var(--text-primary)",
                fontFamily: "'Sora', sans-serif",
              }}>
              Add Item
            </h2>
            {activeCategory && (
              <p
                className="mt-0.5 text-xs"
                style={{ color: "var(--text-muted)" }}>
                Adding to &ldquo;{activeCategory}&rdquo; — shared across all
                projects
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border transition-colors"
            style={{
              borderColor: "var(--border)",
              color: "var(--text-muted)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.backgroundColor = "var(--bg-accent-soft)";
              e.currentTarget.style.color = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "var(--text-muted)";
            }}>
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

        {/* Body */}
        <div className="px-6 py-5">
          <div className="flex flex-col gap-4">
            <div>
              <label
                className="mb-1.5 block text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--text-muted)" }}>
                Item Name
              </label>
              <input
                ref={toolInputRef}
                type="text"
                placeholder="e.g. MATLAB, Microscope, Figma…"
                value={newToolName}
                onChange={(e) => {
                  onToolNameChange(e.target.value);
                  onToolErrorChange("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onAdd();
                  }
                }}
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[var(--accent)] ${
                  toolError ?
                    "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
                  : "border-[var(--border)] bg-[var(--bg-base)]"
                }`}
                style={{
                  color: "var(--text-primary)",
                  placeholderColor: "var(--text-muted)",
                }}
              />
              {toolError && (
                <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">
                  {toolError}
                </p>
              )}
            </div>

            {activeCategory && suggestions.length > 0 && (
              <div>
                <p
                  className="mb-2 text-[11px]"
                  style={{ color: "var(--text-muted)" }}>
                  Quick pick
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((suggestion) => {
                    const alreadyAdded =
                      catalog[activeCategory]?.includes(suggestion);
                    return (
                      <button
                        key={suggestion}
                        type="button"
                        disabled={alreadyAdded}
                        onClick={() => {
                          onToolNameChange(suggestion);
                          onToolErrorChange("");
                        }}
                        className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${
                          alreadyAdded ? "cursor-not-allowed line-through"
                          : newToolName === suggestion ?
                            "border-[var(--accent)] bg-[var(--bg-accent-soft)] text-[var(--accent)]"
                          : "border-[var(--border)] bg-[var(--bg-base)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:bg-[var(--bg-accent-soft)] hover:text-[var(--accent)]"
                        }`}
                        style={
                          alreadyAdded ?
                            {
                              borderColor: "var(--border)",
                              backgroundColor: "var(--bg-hover)",
                              color: "var(--text-muted)",
                            }
                          : undefined
                        }>
                        {suggestion}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-xl border py-2.5 text-sm font-medium transition-colors"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-secondary)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--bg-base)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--bg-card)";
                }}>
                Cancel
              </button>
              <button
                type="button"
                onClick={onAdd}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold text-white transition-colors"
                style={{
                  backgroundColor: "var(--accent)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--accent-hover)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--accent)";
                }}>
                Add Item
              </button>
            </div>
          </div>
        </div>
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
