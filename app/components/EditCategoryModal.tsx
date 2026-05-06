"use client";

import { useRef, useEffect, useState } from "react";
import { Modal } from "./Modal";

type ToolsMap = Record<string, string[]>;

type Props = {
  isOpen: boolean;
  onClose: () => void;
  categoryName: string | null;
  existingCategories: ToolsMap;
  onEdit: (oldName: string, newName: string) => void;
};

export function EditCategoryModal({
  isOpen,
  onClose,
  categoryName,
  existingCategories,
  onEdit,
}: Props) {
  const [editCategoryName, setEditCategoryName] = useState("");
  const [editCategoryError, setEditCategoryError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && categoryName) {
      setEditCategoryName(categoryName);
      setEditCategoryError("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, categoryName]);

  const handleClose = () => {
    setEditCategoryName("");
    setEditCategoryError("");
    onClose();
  };

  const handleEdit = () => {
    if (!categoryName) return;
    const newName = editCategoryName.trim();
    if (!newName) {
      setEditCategoryError("Category name cannot be empty.");
      return;
    }
    if (newName === categoryName) {
      onClose();
      return;
    }
    if (existingCategories[newName] !== undefined) {
      setEditCategoryError("This category already exists.");
      return;
    }
    onEdit(categoryName, newName);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Category"
      subtitle="Rename this category across all your projects">
      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#B0ADA7]">
            Category Name
          </label>
          <input
            ref={inputRef}
            type="text"
            placeholder="New category name"
            value={editCategoryName}
            onChange={(e) => {
              setEditCategoryName(e.target.value);
              setEditCategoryError("");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleEdit();
              }
            }}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#1A1916] placeholder:text-[#B0ADA7] outline-none transition-colors focus:border-[#E8610A] ${
              editCategoryError ?
                "border-red-300 bg-red-50"
              : "border-[#E8E4DE] bg-[#FDFCFB]"
            }`}
          />
          {editCategoryError && (
            <p className="mt-1.5 text-xs text-red-500">{editCategoryError}</p>
          )}
        </div>

        <div className="flex gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 rounded-xl border border-[#E8E4DE] bg-white py-2.5 text-sm font-medium text-[#72706A] transition-colors hover:bg-[#F9F7F4]">
            Cancel
          </button>
          <button
            type="button"
            onClick={handleEdit}
            className="flex-1 rounded-xl bg-[#E8610A] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#D15508]">
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
}
