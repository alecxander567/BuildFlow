"use client";

import { useRef, useState } from "react";
import {
  type Priority,
  type ProjectType,
  type DailyPlan,
} from "@/app/hooks/useProject";
import ToolsField from "./ToolsField";
import DailyTasksField from "./DailTasksField";

export const PROJECT_TYPES: ProjectType[] = [
  "Engineering",
  "Technology",
  "Research",
  "Medical",
  "Art & Design",
  "Literature",
  "Business",
  "Others",
];

export const PRIORITY_OPTIONS: Priority[] = ["High", "Moderate", "Low"];

const priorityStyles: Record<Priority, string> = {
  High: "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]",
  Moderate: "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]",
  Low: "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]",
};

const priorityDot: Record<Priority, string> = {
  High: "bg-[#DC2626]",
  Moderate: "bg-[#D97706]",
  Low: "bg-[#16A34A]",
};

type Props = {
  title: string;
  description: string;
  projectType: ProjectType;
  priority: Priority;
  projectUrl: string;
  submitted: boolean;
  onTitleChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onProjectTypeChange: (value: ProjectType) => void;
  onPriorityChange: (value: Priority) => void;
  onProjectUrlChange: (value: string) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  // Daily plan — per-project
  dailyPlan: DailyPlan;
  onDailyPlanChange: (plan: DailyPlan) => void;
  // Global tool catalog (from useUserTools) — shared across all projects
  catalog: Record<string, string[]>;
  onCatalogChange: (catalog: Record<string, string[]>) => void;
  // Per-project selection
  selectedTools: Record<string, string[]>;
  onSelectedToolsChange: (value: Record<string, string[]>) => void;
  // Form action props
  isEditMode: boolean;
  loading: boolean;
  redirecting: boolean;
  onCancel: () => void;
};

export default function ProjectFormFields({
  title,
  description,
  projectType,
  priority,
  projectUrl,
  submitted,
  onTitleChange,
  onDescriptionChange,
  onProjectTypeChange,
  onPriorityChange,
  onProjectUrlChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  dailyPlan,
  onDailyPlanChange,
  catalog,
  onCatalogChange,
  selectedTools,
  onSelectedToolsChange,
  isEditMode,
  loading,
  redirecting,
  onCancel,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setCoverPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const removeImage = () => {
    setCoverFile(null);
    setCoverPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <>
      {/* Title */}
      <div className="rounded-2xl border border-[#EDE8E2] bg-white p-5">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#B0ADA7]">
          Project Title *
        </label>
        <input
          type="text"
          placeholder="e.g. Redesign Landing Page"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#1A1916] placeholder:text-[#B0ADA7] outline-none transition-colors focus:border-[#E8610A] ${
            submitted && !title.trim() ?
              "border-red-300 bg-red-50"
            : "border-[#E8E4DE] bg-[#FDFCFB]"
          }`}
        />
        {submitted && !title.trim() && (
          <p className="mt-1 text-xs text-red-500">Title is required.</p>
        )}
      </div>

      {/* Description */}
      <div className="rounded-2xl border border-[#EDE8E2] bg-white p-5">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#B0ADA7]">
          Description
        </label>
        <textarea
          rows={3}
          placeholder="What is this project about?"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="w-full resize-none rounded-xl border border-[#E8E4DE] bg-[#FDFCFB] px-3.5 py-2.5 text-sm text-[#1A1916] placeholder:text-[#B0ADA7] outline-none transition-colors focus:border-[#E8610A]"
        />
      </div>

      {/* Project Type */}
      <div className="rounded-2xl border border-[#EDE8E2] bg-white p-5">
        <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-[#B0ADA7]">
          Project Type
        </label>
        <div className="flex flex-wrap gap-2">
          {PROJECT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onProjectTypeChange(type)}
              className={`rounded-xl border px-3.5 py-1.5 text-xs font-medium transition-all ${
                projectType === type ?
                  "border-[#F5C89A] bg-[#FEF0E7] text-[#E8610A]"
                : "border-[#E8E4DE] bg-[#FDFCFB] text-[#72706A] hover:border-[#F5C89A] hover:bg-[#FEF0E7] hover:text-[#E8610A]"
              }`}>
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Priority */}
      <div className="rounded-2xl border border-[#EDE8E2] bg-white p-5">
        <label className="mb-3 block text-xs font-semibold uppercase tracking-widest text-[#B0ADA7]">
          Priority Level
        </label>
        <div className="flex gap-2">
          {PRIORITY_OPTIONS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPriorityChange(p)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-all ${
                priority === p ?
                  priorityStyles[p]
                : "border-[#E8E4DE] bg-[#FDFCFB] text-[#72706A] hover:bg-[#F9F7F4]"
              }`}>
              <span
                className={`h-2 w-2 rounded-full ${priority === p ? priorityDot[p] : "bg-[#D1D5DB]"}`}
              />
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Start & End Date */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 rounded-2xl border border-[#EDE8E2] bg-white p-5">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#B0ADA7]">
            Start Date *
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#1A1916] outline-none transition-colors focus:border-[#E8610A] ${
              submitted && !startDate.trim() ?
                "border-red-300 bg-red-50"
              : "border-[#E8E4DE] bg-[#FDFCFB]"
            }`}
          />
          {submitted && !startDate.trim() && (
            <p className="mt-1 text-xs text-red-500">Start date is required.</p>
          )}
        </div>

        <div className="flex-1 rounded-2xl border border-[#EDE8E2] bg-white p-5">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-[#B0ADA7]">
            End Date *
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-[#1A1916] outline-none transition-colors focus:border-[#E8610A] ${
              submitted && !endDate.trim() ?
                "border-red-300 bg-red-50"
              : "border-[#E8E4DE] bg-[#FDFCFB]"
            }`}
          />
          {submitted && !endDate.trim() && (
            <p className="mt-1 text-xs text-red-500">End date is required.</p>
          )}
        </div>
      </div>

      {/* Daily Goals — unlocks once both dates are set */}
      <DailyTasksField
        startDate={startDate}
        endDate={endDate}
        dailyPlan={dailyPlan}
        onChange={onDailyPlanChange}
      />

      {/* Project Link */}
      <div className="rounded-2xl border border-[#EDE8E2] bg-white p-5">
        <div className="mb-1.5 flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-widest text-[#B0ADA7]">
            Project Link
          </label>
          <span className="rounded-md bg-[#F3F4F6] px-2 py-0.5 text-[10px] font-medium text-[#9CA3AF]">
            Optional
          </span>
        </div>
        <div className="relative">
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B0ADA7]">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </span>
          <input
            type="url"
            placeholder="GitHub repo, published paper, live site…"
            value={projectUrl}
            onChange={(e) => onProjectUrlChange(e.target.value)}
            className="w-full rounded-xl border border-[#E8E4DE] bg-[#FDFCFB] py-2.5 pl-9 pr-3.5 text-sm text-[#1A1916] placeholder:text-[#B0ADA7] outline-none transition-colors focus:border-[#E8610A]"
          />
        </div>
        <p className="mt-1.5 text-[11px] text-[#B0ADA7]">
          GitHub, paper DOI, Figma link, deployment URL, etc.
        </p>
      </div>

      {/* Tools Used — catalog is global, selections are per-project */}
      <ToolsField
        catalog={catalog}
        onCatalogChange={onCatalogChange}
        selectedTools={selectedTools}
        onSelectedToolsChange={onSelectedToolsChange}
      />

      {/* Cover Image */}
      <div className="rounded-2xl border border-[#EDE8E2] bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <label className="block text-xs font-semibold uppercase tracking-widest text-[#B0ADA7]">
            Cover Image
          </label>
          <span className="rounded-md bg-[#F3F4F6] px-2 py-0.5 text-[10px] font-medium text-[#9CA3AF]">
            Optional
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {coverPreview ?
          <div className="relative overflow-hidden rounded-xl border border-[#EDE8E2]">
            <img
              src={coverPreview}
              alt="Cover preview"
              className="h-40 w-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity hover:opacity-100">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-[#1A1916] transition-colors hover:bg-white">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Replace
              </button>
              <button
                type="button"
                onClick={removeImage}
                className="flex items-center gap-1.5 rounded-lg bg-red-500/90 px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-500">
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
                Remove
              </button>
            </div>
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-lg bg-black/60 px-2.5 py-1">
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="max-w-[180px] truncate text-[10px] font-medium text-white">
                {coverFile?.name}
              </span>
            </div>
          </div>
        : <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            className={`flex w-full flex-col items-center justify-center gap-2.5 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-all ${
              isDragging ?
                "border-[#E8610A] bg-[#FEF0E7]"
              : "border-[#E8E4DE] bg-[#FDFCFB] hover:border-[#F5C89A] hover:bg-[#FEF0E7]"
            }`}>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                isDragging ?
                  "border-[#F5C89A] bg-[#FEF0E7] text-[#E8610A]"
                : "border-[#E8E4DE] bg-white text-[#B0ADA7]"
              }`}>
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <div>
              <p
                className={`text-sm font-medium transition-colors ${isDragging ? "text-[#E8610A]" : "text-[#72706A]"}`}>
                {isDragging ?
                  "Drop image here"
                : "Click to upload or drag & drop"}
              </p>
              <p className="mt-0.5 text-[11px] text-[#B0ADA7]">
                PNG, JPG, WEBP · Max 10MB · Will be uploaded to Cloudinary
              </p>
            </div>
          </button>
        }
      </div>

      {/* Actions */}
      <div className="flex gap-3 pb-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-[#E8E4DE] bg-white py-3 text-sm font-medium text-[#72706A] transition-colors hover:border-[#F5C89A] hover:bg-[#FEF0E7] hover:text-[#E8610A]">
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || redirecting}
          className="flex-1 rounded-xl bg-[#E8610A] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#D15508] active:scale-[0.987] disabled:opacity-60 disabled:cursor-not-allowed">
          {loading ?
            isEditMode ?
              "Saving..."
            : "Creating..."
          : redirecting ?
            "Redirecting..."
          : isEditMode ?
            "Save Changes"
          : "Create Project"}
        </button>
      </div>
    </>
  );
}
