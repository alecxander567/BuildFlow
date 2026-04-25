"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

type ToolsMap = Record<string, string[]>;

type Props = {
  // The user's global tool catalog (from useUserTools). ToolsField can ADD
  // categories/tools to this catalog — those changes go back to Firestore
  // via onCatalogChange so every project sees them.
  catalog: ToolsMap;
  onCatalogChange: (catalog: ToolsMap) => void;

  // Per-project selection: which tools from the catalog are used here.
  selectedTools: ToolsMap;
  onSelectedToolsChange: (selected: ToolsMap) => void;
};

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

function Modal({ isOpen, onClose, title, subtitle, children }: ModalProps) {
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

const CATEGORY_SUGGESTIONS = [
  "Software",
  "Hardware",
  "Research",
  "Design",
  "Writing",
  "Data & Analytics",
  "Communication",
  "Management",
  "Laboratory",
  "Field Work",
];

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

export default function ToolsField({
  catalog,
  onCatalogChange,
  selectedTools,
  onSelectedToolsChange,
}: Props) {
  const safeCatalog = catalog ?? {};
  const safeSelected = selectedTools ?? {};

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [toolModalOpen, setToolModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newToolName, setNewToolName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [toolError, setToolError] = useState("");

  const categoryInputRef = useRef<HTMLInputElement>(null);
  const toolInputRef = useRef<HTMLInputElement>(null);

  const hasCategories = Object.keys(safeCatalog).length > 0;
  const totalSelected = Object.values(safeSelected).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );

  useEffect(() => {
    if (categoryModalOpen)
      setTimeout(() => categoryInputRef.current?.focus(), 50);
  }, [categoryModalOpen]);

  useEffect(() => {
    if (toolModalOpen) setTimeout(() => toolInputRef.current?.focus(), 50);
  }, [toolModalOpen]);

  const openCategoryModal = () => {
    setNewCategoryName("");
    setCategoryError("");
    setCategoryModalOpen(true);
  };

  const openAddTool = (category: string) => {
    setActiveCategory(category);
    setNewToolName("");
    setToolError("");
    setToolModalOpen(true);
  };

  const handleAddCategory = () => {
    const name = newCategoryName.trim();
    if (!name) {
      setCategoryError("Category name cannot be empty.");
      return;
    }
    if (safeCatalog[name] !== undefined) {
      setCategoryError("This category already exists.");
      return;
    }
    // Write to global catalog
    onCatalogChange({ ...safeCatalog, [name]: [] });
    setNewCategoryName("");
    setCategoryError("");
    setCategoryModalOpen(false);
  };

  const handleDeleteCategory = (category: string) => {
    // Remove from global catalog
    const updatedCatalog = { ...safeCatalog };
    delete updatedCatalog[category];
    onCatalogChange(updatedCatalog);
    // Also clean up this project's selections for that category
    const updatedSelected = { ...safeSelected };
    delete updatedSelected[category];
    onSelectedToolsChange(updatedSelected);
  };

  const handleAddTool = () => {
    if (!activeCategory) return;
    const name = newToolName.trim();
    if (!name) {
      setToolError("Tool name cannot be empty.");
      return;
    }
    if (safeCatalog[activeCategory]?.includes(name)) {
      setToolError("This tool already exists in the category.");
      return;
    }
    // Write to global catalog
    onCatalogChange({
      ...safeCatalog,
      [activeCategory]: [...(safeCatalog[activeCategory] ?? []), name],
    });
    setNewToolName("");
    setToolError("");
    setToolModalOpen(false);
  };

  const handleDeleteTool = (category: string, tool: string) => {
    // Remove from global catalog
    onCatalogChange({
      ...safeCatalog,
      [category]: safeCatalog[category].filter((t) => t !== tool),
    });
    // Clean up project selection if it was selected
    const updatedSelected = { ...safeSelected };
    updatedSelected[category] = (updatedSelected[category] ?? []).filter(
      (t) => t !== tool,
    );
    if (updatedSelected[category].length === 0)
      delete updatedSelected[category];
    onSelectedToolsChange(updatedSelected);
  };

  const toggleTool = (category: string, tool: string) => {
    const current = safeSelected[category] ?? [];
    const updated =
      current.includes(tool) ?
        current.filter((t) => t !== tool)
      : [...current, tool];
    const next = { ...safeSelected };
    if (updated.length === 0) delete next[category];
    else next[category] = updated;
    onSelectedToolsChange(next);
  };

  const isSelected = (category: string, tool: string) =>
    (safeSelected[category] ?? []).includes(tool);

  return (
    <>
      <div className="rounded-2xl border border-[#EDE8E2] bg-white p-5">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <label className="block text-xs font-semibold uppercase tracking-widest text-[#B0ADA7]">
              Tools & Resources
            </label>
            {totalSelected > 0 && (
              <span className="rounded-full bg-[#FEF0E7] px-2 py-0.5 text-[10px] font-semibold text-[#E8610A]">
                {totalSelected} selected
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Hint that catalog is shared */}
            <span
              title="Categories and tools are shared across all your projects. Selections are per-project."
              className="hidden sm:flex cursor-default items-center gap-1 rounded-md bg-[#F3F4F6] px-2 py-0.5 text-[10px] font-medium text-[#9CA3AF]">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
              Shared catalog
            </span>
            <span className="rounded-md bg-[#F3F4F6] px-2 py-0.5 text-[10px] font-medium text-[#9CA3AF]">
              Optional
            </span>
          </div>
        </div>

        {/* Empty state */}
        {!hasCategories && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#E8E4DE] bg-[#FDFCFB] px-6 py-8 text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E8E4DE] bg-white text-[#B0ADA7]">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <path d="M8 21h8M12 17v4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-[#72706A]">
                No categories yet
              </p>
              <p className="mt-0.5 text-[11px] text-[#B0ADA7]">
                Build your tool catalog once — reuse it across every project
              </p>
            </div>
            <button
              type="button"
              onClick={openCategoryModal}
              className="flex items-center gap-1.5 rounded-xl border border-[#F5C89A] bg-[#FEF0E7] px-4 py-2 text-xs font-semibold text-[#E8610A] transition-colors hover:bg-[#FDDFBF]">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add Category
            </button>
          </div>
        )}

        {/* Categories + tools */}
        {hasCategories && (
          <div className="flex flex-col gap-5">
            {Object.entries(safeCatalog).map(([category, categoryTools]) => (
              <div key={category}>
                {/* Category row */}
                <div className="mb-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#72706A]">
                      {category}
                    </span>
                    {(safeSelected[category]?.length ?? 0) > 0 && (
                      <span className="rounded-full bg-[#FEF0E7] px-1.5 py-0.5 text-[9px] font-bold text-[#E8610A]">
                        {safeSelected[category].length}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openAddTool(category)}
                      className="flex items-center gap-1.5 rounded-lg border border-[#F5C89A] bg-[#FEF0E7] px-2.5 py-1 text-[11px] font-semibold text-[#E8610A] transition-colors hover:bg-[#FDDFBF]">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                      Add item
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(category)}
                      className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-500 transition-colors hover:bg-red-100"
                      title="Removes this category from your catalog across all projects">
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6M14 11v6M9 6V4h6v2" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>

                {/* Tool chips — click to toggle selection for THIS project */}
                {categoryTools.length === 0 ?
                  <button
                    type="button"
                    onClick={() => openAddTool(category)}
                    className="flex items-center gap-1.5 rounded-xl border border-dashed border-[#E8E4DE] px-3.5 py-1.5 text-xs text-[#B0ADA7] transition-colors hover:border-[#F5C89A] hover:text-[#E8610A]">
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add first item
                  </button>
                : <div className="flex flex-wrap gap-2">
                    {categoryTools.map((tool) => {
                      const selected = isSelected(category, tool);
                      return (
                        <div key={tool} className="group relative">
                          <button
                            type="button"
                            onClick={() => toggleTool(category, tool)}
                            className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-medium transition-all ${
                              selected ?
                                "border-[#F5C89A] bg-[#FEF0E7] text-[#E8610A]"
                              : "border-[#E8E4DE] bg-[#FDFCFB] text-[#72706A] hover:border-[#F5C89A] hover:bg-[#FEF0E7] hover:text-[#E8610A]"
                            }`}>
                            {selected && (
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                            {tool}
                          </button>
                          {/* Delete from catalog */}
                          <button
                            type="button"
                            onClick={() => handleDeleteTool(category, tool)}
                            className="absolute -right-1.5 -top-1.5 hidden h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white group-hover:flex"
                            title={`Remove "${tool}" from catalog`}>
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
                        </div>
                      );
                    })}
                  </div>
                }

                <div className="mt-4 border-b border-[#F3F0EB]" />
              </div>
            ))}

            <button
              type="button"
              onClick={openCategoryModal}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-[#E8E4DE] py-2.5 text-xs font-medium text-[#B0ADA7] transition-colors hover:border-[#F5C89A] hover:bg-[#FEF0E7] hover:text-[#E8610A]">
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add another category
            </button>
          </div>
        )}
      </div>

      <Modal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        title="New Category"
        subtitle="Added to your shared catalog — available in all projects">
        <div className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#B0ADA7]">
              Category Name
            </label>
            <input
              ref={categoryInputRef}
              type="text"
              placeholder="e.g. Software, Laboratory, Writing…"
              value={newCategoryName}
              onChange={(e) => {
                setNewCategoryName(e.target.value);
                setCategoryError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCategory();
                }
              }}
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#1A1916] placeholder:text-[#B0ADA7] outline-none transition-colors focus:border-[#E8610A] ${
                categoryError ?
                  "border-red-300 bg-red-50"
                : "border-[#E8E4DE] bg-[#FDFCFB]"
              }`}
            />
            {categoryError && (
              <p className="mt-1.5 text-xs text-red-500">{categoryError}</p>
            )}
          </div>

          <div>
            <p className="mb-2 text-[11px] text-[#B0ADA7]">Quick pick</p>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_SUGGESTIONS.map((suggestion) => {
                const taken = safeCatalog[suggestion] !== undefined;
                return (
                  <button
                    key={suggestion}
                    type="button"
                    disabled={taken}
                    onClick={() => {
                      setNewCategoryName(suggestion);
                      setCategoryError("");
                    }}
                    className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition-all ${
                      taken ?
                        "cursor-not-allowed border-[#E8E4DE] bg-[#F3F4F6] text-[#C4C2BE] line-through"
                      : newCategoryName === suggestion ?
                        "border-[#F5C89A] bg-[#FEF0E7] text-[#E8610A]"
                      : "border-[#E8E4DE] bg-[#FDFCFB] text-[#72706A] hover:border-[#F5C89A] hover:bg-[#FEF0E7] hover:text-[#E8610A]"
                    }`}>
                    {suggestion}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setCategoryModalOpen(false)}
              className="flex-1 rounded-xl border border-[#E8E4DE] bg-white py-2.5 text-sm font-medium text-[#72706A] transition-colors hover:bg-[#F9F7F4]">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddCategory}
              className="flex-1 rounded-xl bg-[#E8610A] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#D15508]">
              Add Category
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={toolModalOpen}
        onClose={() => setToolModalOpen(false)}
        title="Add Item"
        subtitle={
          activeCategory ?
            `Adding to "${activeCategory}" — shared across all projects`
          : undefined
        }>
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
                setNewToolName(e.target.value);
                setToolError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTool();
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

          {activeCategory && (
            <div>
              <p className="mb-2 text-[11px] text-[#B0ADA7]">Quick pick</p>
              <div className="flex flex-wrap gap-1.5">
                {(
                  TOOL_SUGGESTIONS[activeCategory] ??
                  TOOL_SUGGESTIONS["_default"]
                ).map((suggestion) => {
                  const alreadyAdded =
                    safeCatalog[activeCategory]?.includes(suggestion);
                  return (
                    <button
                      key={suggestion}
                      type="button"
                      disabled={alreadyAdded}
                      onClick={() => {
                        setNewToolName(suggestion);
                        setToolError("");
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
              onClick={() => setToolModalOpen(false)}
              className="flex-1 rounded-xl border border-[#E8E4DE] bg-white py-2.5 text-sm font-medium text-[#72706A] transition-colors hover:bg-[#F9F7F4]">
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddTool}
              className="flex-1 rounded-xl bg-[#E8610A] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#D15508]">
              Add Item
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
