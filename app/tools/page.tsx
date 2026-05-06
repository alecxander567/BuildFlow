"use client";

import { useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { useUserTools } from "@/app/hooks/useUserTools";
import {
  PencilIcon,
  TrashIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";

import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";
import { AlertContainer, useAlert } from "../components/Alert";
import { AddCategoryModal } from "../components/AddCategoryModal";
import { EditCategoryModal } from "../components/EditCategoryModal";
import ConfirmationModal from "../components/ConfirmationModal";

export default function UserToolsPage() {
  const { user, authLoading } = useAuth();
  const {
    userTools,
    loaded,
    error,
    addCategory,
    deleteCategory,
    addTool,
    deleteTool,
    updateTool,
    updateCategory,
  } = useUserTools(user);

  const { toasts, remove, show } = useAlert();

  const [addCategoryOpen, setAddCategoryOpen] = useState(false);

  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deletingCategory, setDeletingCategory] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [editingTool, setEditingTool] = useState<{
    category: string;
    tool: string;
  } | null>(null);
  const [editingToolValue, setEditingToolValue] = useState("");

  const [addingToolTo, setAddingToolTo] = useState<string | null>(null);
  const [newToolName, setNewToolName] = useState("");

  const isLoading = authLoading || !loaded;

  if (!authLoading && !user) {
    return (
      <div
        className="flex h-screen overflow-hidden bg-[#F9F7F4]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden pt-[53px] md:pt-0">
          <TopBar />
          <main className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FEF0E7]">
                <WrenchScrewdriverIcon className="h-7 w-7 text-[#E8610A]" />
              </div>
              <h2
                className="text-lg font-bold text-[#1A1916]"
                style={{ fontFamily: "'Sora', sans-serif" }}>
                Please sign in
              </h2>
              <p className="mt-1 text-sm text-[#B0ADA7]">
                You need to be logged in to manage your tools.
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const handleAddCategory = async (name: string) => {
    const success = await addCategory(name);
    if (success) {
      show("success", "Category created successfully.", "Category added");
    } else {
      show("error", "Category already exists or couldn't be created.", "Error");
    }
  };

  const handleEditCategory = async (oldName: string, newName: string) => {
    const success = await updateCategory(oldName, newName);
    if (success) {
      show("success", "Category renamed successfully.", "Category updated");
    } else {
      show("error", "Name might already exist.", "Could not update category");
    }
  };

  const openDeleteCategory = (categoryName: string) => {
    setDeletingCategory(categoryName);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDeleteCategory = async () => {
    if (!deletingCategory) return;
    setDeleteLoading(true);
    await deleteCategory(deletingCategory);
    show(
      "success",
      `"${deletingCategory}" has been removed.`,
      "Category deleted",
    );
    setDeleteLoading(false);
    setDeleteConfirmOpen(false);
    setDeletingCategory(null);
  };

  const handleAddTool = async (categoryName: string) => {
    if (!newToolName.trim()) return;
    const success = await addTool(categoryName, newToolName.trim());
    if (success) {
      setNewToolName("");
      setAddingToolTo(null);
      show("success", "Tool added successfully.", "Tool added");
    } else {
      show("error", "Tool already exists in this category.", "Error");
    }
  };

  const handleDeleteTool = async (categoryName: string, toolName: string) => {
    await deleteTool(categoryName, toolName);
    show("success", `"${toolName}" has been removed.`, "Tool deleted");
  };

  const handleUpdateTool = async () => {
    if (
      editingTool &&
      editingToolValue.trim() &&
      editingToolValue !== editingTool.tool
    ) {
      const success = await updateTool(
        editingTool.category,
        editingTool.tool,
        editingToolValue.trim(),
      );
      if (!success) show("error", "Could not update tool.", "Error");
    }
    setEditingTool(null);
    setEditingToolValue("");
  };

  const hasTools = Object.keys(userTools).length > 0;

  const inputCls =
    "flex-1 rounded-xl border border-[#EDE8E2] bg-[#F9F7F4] px-3 py-1.5 text-sm text-[#1A1916] placeholder-[#B0ADA7] focus:border-[#E8610A] focus:outline-none focus:ring-1 focus:ring-[#E8610A]";

  return (
    <div
      className="flex h-screen overflow-hidden bg-[#F9F7F4]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden pt-[53px] md:pt-0">
        <TopBar />

        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 md:px-8 md:py-7">
          <div className="mx-auto max-w-6xl flex flex-col gap-5 md:gap-7">
            {/* ── Page header ── */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1
                  className="text-base font-bold text-[#1A1916] sm:text-lg"
                  style={{ fontFamily: "'Sora', sans-serif" }}>
                  My Tools
                </h1>
                <p className="text-xs text-[#B0ADA7]">
                  {isLoading ?
                    "Loading…"
                  : `${Object.keys(userTools).length} categor${Object.keys(userTools).length !== 1 ? "ies" : "y"}`
                  }
                </p>
              </div>

              {!isLoading && (
                <button
                  onClick={() => setAddCategoryOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-[#E8610A] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#D15508] active:scale-[0.987]">
                  <PlusIcon className="h-4 w-4" />
                  New Category
                </button>
              )}
            </div>

            {/* ── Error ── */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* ── Loading ── */}
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#E8610A] border-t-transparent" />
                  <p className="mt-2 text-sm text-[#72706A]">
                    Loading your tools…
                  </p>
                </div>
              </div>
            )}

            {/* ── Empty state ── */}
            {!isLoading && !error && !hasTools && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#D6D1CA] bg-white py-16 px-6 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FEF0E7]">
                  <WrenchScrewdriverIcon className="h-7 w-7 text-[#E8610A]" />
                </div>
                <h3
                  className="mb-1 text-sm font-semibold text-[#1A1916]"
                  style={{ fontFamily: "'Sora', sans-serif" }}>
                  No tools yet
                </h3>
                <p className="mb-5 max-w-xs text-xs leading-relaxed text-[#B0ADA7]">
                  Create a category to start organising your tools and keep your
                  workflow in one place.
                </p>
                <button
                  onClick={() => setAddCategoryOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-[#E8610A] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#D15508] active:scale-[0.987]">
                  <PlusIcon className="h-4 w-4" />
                  Add your first category
                </button>
              </div>
            )}

            {/* ── Tools list (full-width cards) ── */}
            {!isLoading && hasTools && (
              <div className="flex flex-col gap-4">
                {Object.entries(userTools).map(([categoryName, tools]) => (
                  <div
                    key={categoryName}
                    className="w-full rounded-2xl border border-[#EDE8E2] bg-white shadow-sm overflow-hidden">
                    {/* Category header */}
                    <div className="flex items-center justify-between border-b border-[#EDE8E2] bg-[#FDFCFB] px-5 py-3.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#FEF0E7]">
                          <WrenchScrewdriverIcon className="h-4 w-4 text-[#E8610A]" />
                        </span>
                        <h2
                          className="truncate text-sm font-semibold text-[#1A1916]"
                          style={{ fontFamily: "'Sora', sans-serif" }}>
                          {categoryName}
                        </h2>
                        <span className="shrink-0 rounded-full bg-[#F2EDE7] px-2 py-0.5 text-[10px] font-medium text-[#72706A]">
                          {(tools as string[]).length}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 ml-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingCategory(categoryName);
                            setEditCategoryOpen(true);
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F2EDE7] text-[#E8610A] transition-colors hover:bg-[#E8610A] hover:text-white"
                          title="Edit category">
                          <PencilIcon className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => openDeleteCategory(categoryName)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50 text-red-400 transition-colors hover:bg-red-500 hover:text-white"
                          title="Delete category">
                          <TrashIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Pills + add input */}
                    <div className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        {(tools as string[]).map((tool) =>
                          (
                            editingTool?.category === categoryName &&
                            editingTool?.tool === tool
                          ) ?
                            /* ── Inline edit pill ── */
                            <div
                              key={tool}
                              className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={editingToolValue}
                                onChange={(e) =>
                                  setEditingToolValue(e.target.value)
                                }
                                className="rounded-full border border-[#E8610A] bg-[#FEF0E7] px-3 py-1 text-xs text-[#1A1916] focus:outline-none focus:ring-1 focus:ring-[#E8610A] w-32"
                                onKeyDown={(e) =>
                                  e.key === "Enter" && handleUpdateTool()
                                }
                                autoFocus
                              />
                              <button
                                onClick={handleUpdateTool}
                                className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E8610A] text-white hover:bg-[#D15508]">
                                <CheckIcon className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingTool(null);
                                  setEditingToolValue("");
                                }}
                                className="flex h-6 w-6 items-center justify-center rounded-full border border-[#EDE8E2] bg-white text-[#72706A] hover:bg-[#F2EDE7]">
                                <XMarkIcon className="h-3 w-3" />
                              </button>
                            </div>
                          : /* ── Tool pill ── */
                            <div
                              key={tool}
                              className="group relative flex h-8 items-center gap-1.5 rounded-full border border-[#EDE8E2] bg-[#F9F7F4] pl-3 pr-2 transition-all hover:border-[#E8610A] hover:bg-[#FEF0E7]">
                              <span className="text-xs font-medium text-[#1A1916] leading-none">
                                {tool}
                              </span>
                              <button
                                onClick={() => {
                                  setEditingTool({
                                    category: categoryName,
                                    tool,
                                  });
                                  setEditingToolValue(tool);
                                }}
                                className="hidden h-4 w-4 items-center justify-center rounded-full text-[#B0ADA7] transition-colors group-hover:flex hover:text-[#E8610A]"
                                title="Edit tool">
                                <PencilIcon className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteTool(categoryName, tool)
                                }
                                className="hidden h-4 w-4 items-center justify-center rounded-full bg-[#EDE8E2] text-[#72706A] transition-colors group-hover:flex hover:bg-red-100 hover:text-red-500"
                                title="Delete tool">
                                <XMarkIcon className="h-2.5 w-2.5" />
                              </button>
                            </div>,
                        )}

                        {/* Add tool inline */}
                        {addingToolTo === categoryName ?
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={newToolName}
                              onChange={(e) => setNewToolName(e.target.value)}
                              placeholder="Tool name"
                              className="h-8 rounded-full border border-[#E8610A] bg-[#FEF0E7] px-3 text-xs text-[#1A1916] placeholder-[#B0ADA7] focus:outline-none focus:ring-1 focus:ring-[#E8610A] w-32"
                              onKeyDown={(e) =>
                                e.key === "Enter" && handleAddTool(categoryName)
                              }
                              autoFocus
                            />
                            <button
                              onClick={() => handleAddTool(categoryName)}
                              className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E8610A] text-white hover:bg-[#D15508]">
                              <CheckIcon className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setAddingToolTo(null);
                                setNewToolName("");
                              }}
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-[#EDE8E2] bg-white text-[#72706A] hover:bg-[#F2EDE7]">
                              <XMarkIcon className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        : <button
                            onClick={() => setAddingToolTo(categoryName)}
                            className="flex h-8 items-center gap-1.5 rounded-full border border-dashed border-[#D6D1CA] px-3 text-xs font-medium text-[#B0ADA7] transition-colors hover:border-[#E8610A] hover:text-[#E8610A]">
                            <PlusIcon className="h-3.5 w-3.5" />
                            Add Tool
                          </button>
                        }
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <AlertContainer toasts={toasts} onRemove={remove} position="top-center" />

      {/* ── Add Category Modal ── */}
      <AddCategoryModal
        isOpen={addCategoryOpen}
        onClose={() => setAddCategoryOpen(false)}
        existingCategories={userTools}
        onAdd={handleAddCategory}
      />

      {/* ── Edit Category Modal ── */}
      <EditCategoryModal
        isOpen={editCategoryOpen}
        onClose={() => {
          setEditCategoryOpen(false);
          setEditingCategory(null);
        }}
        categoryName={editingCategory}
        existingCategories={userTools}
        onEdit={handleEditCategory}
      />

      {/* ── Delete Confirmation Modal ── */}
      <ConfirmationModal
        isOpen={deleteConfirmOpen}
        title="Delete Category"
        message={`Are you sure you want to delete "${deletingCategory}" and all its tools? This can't be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        confirmVariant="danger"
        loading={deleteLoading}
        onConfirm={handleConfirmDeleteCategory}
        onCancel={() => {
          if (!deleteLoading) {
            setDeleteConfirmOpen(false);
            setDeletingCategory(null);
          }
        }}
      />
    </div>
  );
}
