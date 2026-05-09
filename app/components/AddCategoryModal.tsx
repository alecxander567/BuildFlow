"use client";

import { useRef, useEffect, useState } from "react";
import { Modal } from "./Modal";

type ToolsMap = Record<string, string[]>;

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

type Props = {
  isOpen: boolean;
  onClose: () => void;
  existingCategories: ToolsMap;
  onAdd: (name: string) => void;
};

export function AddCategoryModal({
  isOpen,
  onClose,
  existingCategories,
  onAdd,
}: Props) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [isOpen]);

  const handleClose = () => {
    setNewCategoryName("");
    setCategoryError("");
    onClose();
  };

  const handleAdd = () => {
    const name = newCategoryName.trim();
    if (!name) {
      setCategoryError("Category name cannot be empty.");
      return;
    }
    if (existingCategories[name] !== undefined) {
      setCategoryError("This category already exists.");
      return;
    }
    onAdd(name);
    setNewCategoryName("");
    setCategoryError("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="New Category"
      subtitle="Added to your shared catalog — available in all projects">
      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)]">
            Category Name
          </label>
          <input
            ref={inputRef}
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
                handleAdd();
              }
            }}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] bg-[var(--bg-card)] outline-none transition-colors focus:border-[var(--accent)] ${
              categoryError ?
                "border-red-300 bg-red-50 dark:bg-red-950/30 dark:border-red-800"
              : "border-[var(--border)]"
            }`}
          />
          {categoryError && (
            <p className="mt-1.5 text-xs text-red-500">{categoryError}</p>
          )}
        </div>

        <div>
          <p className="mb-2 text-[11px] text-[var(--text-muted)]">
            Quick pick
          </p>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORY_SUGGESTIONS.map((suggestion) => {
              const taken = existingCategories[suggestion] !== undefined;
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
                      "cursor-not-allowed border-[var(--border)] bg-[var(--bg-hover)] text-[var(--text-muted)] line-through"
                    : newCategoryName === suggestion ?
                      "border-[var(--accent)] bg-[var(--bg-accent-soft)] text-[var(--accent)]"
                    : "border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:bg-[var(--bg-accent-soft)] hover:text-[var(--accent)]"
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
            onClick={handleClose}
            className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] py-2.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-hover)]">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAdd}
            className="flex-1 rounded-xl bg-[var(--accent)] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--accent-hover)]">
            Add Category
          </button>
        </div>
      </div>
    </Modal>
  );
}
