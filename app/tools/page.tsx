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
import { AddToolModal } from "../components/AddToolModal";
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

  const [addToolModalOpen, setAddToolModalOpen] = useState(false);
  const [addToolCategory, setAddToolCategory] = useState<string | null>(null);
  const [newToolName, setNewToolName] = useState("");
  const [newToolError, setNewToolError] = useState("");

  const isLoading = authLoading || !loaded;

  if (!authLoading && !user) {
    return (
      <div
        className="flex h-screen overflow-hidden"
        style={{
          backgroundColor: "var(--bg-base)",
          fontFamily: "'DM Sans', sans-serif",
        }}>
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden pt-[53px] md:pt-0">
          <TopBar />
          <main className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ backgroundColor: "var(--bg-accent-soft)" }}>
                <WrenchScrewdriverIcon
                  className="h-7 w-7"
                  style={{ color: "var(--accent)" }}
                />
              </div>
              <h2
                className="text-lg font-bold"
                style={{
                  color: "var(--text-primary)",
                  fontFamily: "'Sora', sans-serif",
                }}>
                Please sign in
              </h2>
              <p
                className="mt-1 text-sm"
                style={{ color: "var(--text-muted)" }}>
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

  const openAddToolModal = (categoryName: string) => {
    setAddToolCategory(categoryName);
    setNewToolName("");
    setNewToolError("");
    setAddToolModalOpen(true);
  };

  const handleAddTool = async () => {
    if (!addToolCategory) return;
    const name = newToolName.trim();
    if (!name) {
      setNewToolError("Tool name cannot be empty.");
      return;
    }
    const success = await addTool(addToolCategory, name);
    if (success) {
      setNewToolName("");
      setNewToolError("");
      setAddToolModalOpen(false);
      show("success", "Tool added successfully.", "Tool added");
    } else {
      setNewToolError("Tool already exists in this category.");
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

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        backgroundColor: "var(--bg-base)",
        fontFamily: "'DM Sans', sans-serif",
      }}>
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden pt-[53px] md:pt-0">
        <TopBar />

        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 md:px-8 md:py-7">
          <div className="mx-auto max-w-6xl flex flex-col gap-5 md:gap-7">
            {/* ── Page header ── */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1
                  className="text-base font-bold sm:text-lg"
                  style={{
                    color: "var(--text-primary)",
                    fontFamily: "'Sora', sans-serif",
                  }}>
                  My Tools
                </h1>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {isLoading ?
                    "Loading…"
                  : `${Object.keys(userTools).length} categor${Object.keys(userTools).length !== 1 ? "ies" : "y"}`
                  }
                </p>
              </div>

              {!isLoading && (
                <button
                  onClick={() => setAddCategoryOpen(true)}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors active:scale-[0.987]"
                  style={{
                    backgroundColor: "var(--accent)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--accent-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--accent)";
                  }}>
                  <PlusIcon className="h-4 w-4" />
                  New Category
                </button>
              )}
            </div>

            {/* ── Error ── */}
            {error && (
              <div
                className="rounded-xl border px-4 py-3 text-sm"
                style={{
                  borderColor: "rgba(220, 38, 38, 0.2)",
                  backgroundColor: "rgba(220, 38, 38, 0.1)",
                  color: "#DC2626",
                }}>
                {error}
              </div>
            )}

            {/* ── Loading ── */}
            {isLoading && (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
                    style={{
                      borderColor: "var(--accent)",
                      borderTopColor: "transparent",
                    }}
                  />
                  <p
                    className="mt-2 text-sm"
                    style={{ color: "var(--text-secondary)" }}>
                    Loading your tools…
                  </p>
                </div>
              </div>
            )}

            {/* ── Empty state ── */}
            {!isLoading && !error && !hasTools && (
              <div
                className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-16 px-6 text-center"
                style={{
                  borderColor: "var(--border-dashed)",
                  backgroundColor: "var(--bg-card)",
                }}>
                <div
                  className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: "var(--bg-accent-soft)" }}>
                  <WrenchScrewdriverIcon
                    className="h-7 w-7"
                    style={{ color: "var(--accent)" }}
                  />
                </div>
                <h3
                  className="mb-1 text-sm font-semibold"
                  style={{
                    color: "var(--text-primary)",
                    fontFamily: "'Sora', sans-serif",
                  }}>
                  No tools yet
                </h3>
                <p
                  className="mb-5 max-w-xs text-xs leading-relaxed"
                  style={{ color: "var(--text-muted)" }}>
                  Create a category to start organising your tools and keep your
                  workflow in one place.
                </p>
                <button
                  onClick={() => setAddCategoryOpen(true)}
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors active:scale-[0.987]"
                  style={{
                    backgroundColor: "var(--accent)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "var(--accent-hover)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--accent)";
                  }}>
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
                    className="w-full rounded-2xl border shadow-sm overflow-hidden"
                    style={{
                      borderColor: "var(--border)",
                      backgroundColor: "var(--bg-card)",
                    }}>
                    {/* Category header */}
                    <div
                      className="flex items-center justify-between border-b px-5 py-3.5"
                      style={{
                        borderColor: "var(--border)",
                        backgroundColor: "var(--bg-hover)",
                      }}>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: "var(--bg-accent-soft)" }}>
                          <WrenchScrewdriverIcon
                            className="h-4 w-4"
                            style={{ color: "var(--accent)" }}
                          />
                        </span>
                        <h2
                          className="truncate text-sm font-semibold"
                          style={{
                            color: "var(--text-primary)",
                            fontFamily: "'Sora', sans-serif",
                          }}>
                          {categoryName}
                        </h2>
                        <span
                          className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium"
                          style={{
                            backgroundColor: "var(--bg-accent-soft)",
                            color: "var(--text-secondary)",
                          }}>
                          {(tools as string[]).length}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 ml-2 shrink-0">
                        <button
                          onClick={() => {
                            setEditingCategory(categoryName);
                            setEditCategoryOpen(true);
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
                          style={{
                            backgroundColor: "var(--bg-accent-soft)",
                            color: "var(--accent)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "var(--accent)";
                            e.currentTarget.style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "var(--bg-accent-soft)";
                            e.currentTarget.style.color = "var(--accent)";
                          }}
                          title="Edit category">
                          <PencilIcon className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => openDeleteCategory(categoryName)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
                          style={{
                            backgroundColor: "rgba(220, 38, 38, 0.1)",
                            color: "#DC2626",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#DC2626";
                            e.currentTarget.style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "rgba(220, 38, 38, 0.1)";
                            e.currentTarget.style.color = "#DC2626";
                          }}
                          title="Delete category">
                          <TrashIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Pills + add button */}
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
                                className="rounded-full px-3 py-1 text-xs focus:outline-none focus:ring-1 w-32"
                                style={{
                                  borderColor: "var(--accent)",
                                  backgroundColor: "var(--bg-accent-soft)",
                                  color: "var(--text-primary)",
                                }}
                                onKeyDown={(e) =>
                                  e.key === "Enter" && handleUpdateTool()
                                }
                                autoFocus
                              />
                              <button
                                onClick={handleUpdateTool}
                                className="flex h-6 w-6 items-center justify-center rounded-full text-white transition-colors"
                                style={{ backgroundColor: "var(--accent)" }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "var(--accent-hover)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "var(--accent)";
                                }}>
                                <CheckIcon className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => {
                                  setEditingTool(null);
                                  setEditingToolValue("");
                                }}
                                className="flex h-6 w-6 items-center justify-center rounded-full border transition-colors"
                                style={{
                                  borderColor: "var(--border)",
                                  backgroundColor: "var(--bg-card)",
                                  color: "var(--text-secondary)",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "var(--bg-hover)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "var(--bg-card)";
                                }}>
                                <XMarkIcon className="h-3 w-3" />
                              </button>
                            </div>
                          : /* ── Tool pill ── */
                            <div
                              key={tool}
                              className="group relative flex h-8 items-center gap-1.5 rounded-full border pl-3 pr-2 transition-all"
                              style={{
                                borderColor: "var(--border)",
                                backgroundColor: "var(--bg-base)",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor =
                                  "var(--accent)";
                                e.currentTarget.style.backgroundColor =
                                  "var(--bg-accent-soft)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor =
                                  "var(--border)";
                                e.currentTarget.style.backgroundColor =
                                  "var(--bg-base)";
                              }}>
                              <span
                                className="text-xs font-medium leading-none"
                                style={{ color: "var(--text-primary)" }}>
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
                                className="hidden h-4 w-4 items-center justify-center rounded-full transition-colors group-hover:flex"
                                style={{ color: "var(--text-muted)" }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.color = "var(--accent)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.color =
                                    "var(--text-muted)";
                                }}
                                title="Edit tool">
                                <PencilIcon className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteTool(categoryName, tool)
                                }
                                className="hidden h-4 w-4 items-center justify-center rounded-full transition-colors group-hover:flex"
                                style={{
                                  backgroundColor: "var(--border)",
                                  color: "var(--text-secondary)",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "#DC2626";
                                  e.currentTarget.style.color = "white";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor =
                                    "var(--border)";
                                  e.currentTarget.style.color =
                                    "var(--text-secondary)";
                                }}
                                title="Delete tool">
                                <XMarkIcon className="h-2.5 w-2.5" />
                              </button>
                            </div>,
                        )}

                        {/* Add Tool button → opens modal */}
                        <button
                          onClick={() => openAddToolModal(categoryName)}
                          className="flex h-8 items-center gap-1.5 rounded-full border border-dashed px-3 text-xs font-medium transition-colors"
                          style={{
                            borderColor: "var(--border-dashed)",
                            color: "var(--text-muted)",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "var(--accent)";
                            e.currentTarget.style.color = "var(--accent)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor =
                              "var(--border-dashed)";
                            e.currentTarget.style.color = "var(--text-muted)";
                          }}>
                          <PlusIcon className="h-3.5 w-3.5" />
                          Add Tool
                        </button>
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

      {/* ── Add Tool Modal ── */}
      <AddToolModal
        isOpen={addToolModalOpen}
        onClose={() => setAddToolModalOpen(false)}
        activeCategory={addToolCategory}
        catalog={userTools}
        newToolName={newToolName}
        onToolNameChange={setNewToolName}
        toolError={newToolError}
        onToolErrorChange={setNewToolError}
        onAdd={handleAddTool}
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
