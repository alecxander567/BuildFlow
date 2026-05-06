"use client";

import { useState } from "react";
import { AddCategoryModal } from "./AddCategoryModal";
import { EditCategoryModal } from "./EditCategoryModal";
import { AddToolModal } from "./AddToolModal";

type ToolsMap = Record<string, string[]>;

type Props = {
  catalog: ToolsMap;
  onCatalogChange: (catalog: ToolsMap) => void;
  selectedTools: ToolsMap;
  onSelectedToolsChange: (selected: ToolsMap) => void;
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
  const [editCategoryModalOpen, setEditCategoryModalOpen] = useState(false);
  const [toolModalOpen, setToolModalOpen] = useState(false);

  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const [newToolName, setNewToolName] = useState("");
  const [toolError, setToolError] = useState("");

  const hasCategories = Object.keys(safeCatalog).length > 0;
  const totalSelected = Object.values(safeSelected).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );

  const openCategoryModal = () => setCategoryModalOpen(true);

  const openEditCategoryModal = (category: string) => {
    setEditingCategory(category);
    setEditCategoryModalOpen(true);
  };

  const openAddTool = (category: string) => {
    setActiveCategory(category);
    setNewToolName("");
    setToolError("");
    setToolModalOpen(true);
  };

  const handleAddCategory = (name: string) => {
    onCatalogChange({ ...safeCatalog, [name]: [] });
  };

  const handleEditCategory = (oldName: string, newName: string) => {
    const updatedCatalog: ToolsMap = {};
    Object.keys(safeCatalog).forEach((key) => {
      updatedCatalog[key === oldName ? newName : key] = safeCatalog[key];
    });
    onCatalogChange(updatedCatalog);

    const updatedSelected = { ...safeSelected };
    if (updatedSelected[oldName]) {
      updatedSelected[newName] = updatedSelected[oldName];
      delete updatedSelected[oldName];
      onSelectedToolsChange(updatedSelected);
    }
  };

  const handleDeleteCategory = (category: string) => {
    const updatedCatalog = { ...safeCatalog };
    delete updatedCatalog[category];
    onCatalogChange(updatedCatalog);

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
    onCatalogChange({
      ...safeCatalog,
      [activeCategory]: [...(safeCatalog[activeCategory] ?? []), name],
    });
    setNewToolName("");
    setToolError("");
    setToolModalOpen(false);
  };

  const handleDeleteTool = (category: string, tool: string) => {
    const updatedCatalog = {
      ...safeCatalog,
      [category]: safeCatalog[category].filter((t) => t !== tool),
    };
    onCatalogChange(updatedCatalog);

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
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => openAddTool(category)}
                      title="Add tool to this category"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#F5C89A] bg-[#FEF0E7] text-[#E8610A] transition-colors hover:bg-[#FDDFBF]">
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
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditCategoryModal(category)}
                      title="Edit category name"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-200 bg-blue-50 text-blue-600 transition-colors hover:bg-blue-100">
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(category)}
                      title="Delete this category entirely"
                      className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-500 transition-colors hover:bg-red-100">
                      <svg
                        width="12"
                        height="12"
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
                    </button>
                  </div>
                </div>

                {/* Tool chips */}
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

      {/* ── Add Category Modal ── */}
      <AddCategoryModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        existingCategories={safeCatalog}
        onAdd={handleAddCategory}
      />

      {/* ── Edit Category Modal ── */}
      <EditCategoryModal
        isOpen={editCategoryModalOpen}
        onClose={() => {
          setEditCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        categoryName={editingCategory}
        existingCategories={safeCatalog}
        onEdit={handleEditCategory}
      />

      {/* ── Add Tool Modal (extracted) ── */}
      <AddToolModal
        isOpen={toolModalOpen}
        onClose={() => setToolModalOpen(false)}
        activeCategory={activeCategory}
        catalog={safeCatalog}
        newToolName={newToolName}
        onToolNameChange={setNewToolName}
        toolError={toolError}
        onToolErrorChange={setToolError}
        onAdd={handleAddTool}
      />
    </>
  );
}
