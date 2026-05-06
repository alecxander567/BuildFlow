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
        className="relative z-10 w-full max-w-md rounded-2xl border border-[#EDE8E2] bg-white shadow-2xl shadow-black/10"
        style={{
          animation: "modalIn 0.18s cubic-bezier(0.34,1.56,0.64,1) both",
        }}>
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#F3F0EB] px-6 py-5">
          <div>
            <h2
              className="text-base font-bold text-[#1A1916]"
              style={{ fontFamily: "'Sora', sans-serif" }}>
              Add Item
            </h2>
            {activeCategory && (
              <p className="mt-0.5 text-xs text-[#B0ADA7]">
                Adding to &ldquo;{activeCategory}&rdquo; — shared across all
                projects
              </p>
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

        {/* Body */}
        <div className="px-6 py-5">
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#B0ADA7]">
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
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#1A1916] placeholder:text-[#B0ADA7] outline-none transition-colors focus:border-[#E8610A] ${
                  toolError ?
                    "border-red-300 bg-red-50"
                  : "border-[#E8E4DE] bg-[#FDFCFB]"
                }`}
              />
              {toolError && (
                <p className="mt-1.5 text-xs text-red-500">{toolError}</p>
              )}
            </div>

            {activeCategory && suggestions.length > 0 && (
              <div>
                <p className="mb-2 text-[11px] text-[#B0ADA7]">Quick pick</p>
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
                          alreadyAdded ?
                            "cursor-not-allowed border-[#E8E4DE] bg-[#F3F4F6] text-[#C4C2BE] line-through"
                          : newToolName === suggestion ?
                            "border-[#F5C89A] bg-[#FEF0E7] text-[#E8610A]"
                          : "border-[#E8E4DE] bg-[#FDFCFB] text-[#72706A] hover:border-[#F5C89A] hover:bg-[#FEF0E7] hover:text-[#E8610A]"
                        }`}>
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
                className="flex-1 rounded-xl border border-[#E8E4DE] bg-white py-2.5 text-sm font-medium text-[#72706A] transition-colors hover:bg-[#F9F7F4]">
                Cancel
              </button>
              <button
                type="button"
                onClick={onAdd}
                className="flex-1 rounded-xl bg-[#E8610A] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#D15508]">
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
