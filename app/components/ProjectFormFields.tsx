"use client";

import { useRef, useState } from "react";
import {
  type Priority,
  type ProjectType,
  type DailyPlan,
} from "@/app/hooks/useProject";
import ToolsField from "./ToolsField";
import DailyTasksField from "./DailTasksField";
import CloudinaryUpload from "./CloudinaryUpload";

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
  High: "border-red-200 dark:border-red-800",
  Moderate: "border-amber-200 dark:border-amber-800",
  Low: "border-green-200 dark:border-green-800",
};

const priorityTextColors: Record<Priority, string> = {
  High: "text-[#DC2626] dark:text-[#f87171]",
  Moderate: "text-[#D97706] dark:text-[#fbbf24]",
  Low: "text-[#16A34A] dark:text-[#4ade80]",
};

const priorityBgColors: Record<Priority, string> = {
  High: "bg-[#FEF2F2] dark:bg-[#2a0f0f]",
  Moderate: "bg-[#FFFBEB] dark:bg-[#271a00]",
  Low: "bg-[#F0FDF4] dark:bg-[#0a1f0f]",
};

const priorityDot: Record<Priority, string> = {
  High: "bg-[#DC2626] dark:bg-[#f87171]",
  Moderate: "bg-[#D97706] dark:bg-[#fbbf24]",
  Low: "bg-[#16A34A] dark:bg-[#4ade80]",
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
  // Image URL from Cloudinary
  imageUrl: string;
  onImageUrlChange: (value: string) => void;
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
  imageUrl,
  onImageUrlChange,
  isEditMode,
  loading,
  redirecting,
  onCancel,
}: Props) {
  return (
    <>
      {/* Title */}
      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-card)",
        }}>
        <label
          className="mb-1.5 block text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}>
          Project Title *
        </label>
        <input
          type="text"
          placeholder="e.g. Redesign Landing Page"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[var(--accent)] ${
            submitted && !title.trim() ?
              "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
            : "border-[var(--border)] bg-[var(--bg-base)]"
          }`}
          style={{
            color: "var(--text-primary)",
            placeholderColor: "var(--text-muted)",
          }}
        />
        {submitted && !title.trim() && (
          <p className="mt-1 text-xs text-red-500 dark:text-red-400">
            Title is required.
          </p>
        )}
      </div>

      {/* Description */}
      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-card)",
        }}>
        <label
          className="mb-1.5 block text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}>
          Description
        </label>
        <textarea
          rows={3}
          placeholder="What is this project about?"
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="w-full resize-none rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[var(--accent)]"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-base)",
            color: "var(--text-primary)",
            placeholderColor: "var(--text-muted)",
          }}
        />
      </div>

      {/* Project Type */}
      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-card)",
        }}>
        <label
          className="mb-3 block text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}>
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
                  "border-[var(--accent)] bg-[var(--bg-accent-soft)] text-[var(--accent)]"
                : "border-[var(--border)] bg-[var(--bg-base)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:bg-[var(--bg-accent-soft)] hover:text-[var(--accent)]"
              }`}>
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Priority */}
      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-card)",
        }}>
        <label
          className="mb-3 block text-xs font-semibold uppercase tracking-widest"
          style={{ color: "var(--text-muted)" }}>
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
                  `${priorityBgColors[p]} ${priorityTextColors[p]} ${priorityStyles[p]}`
                : "border-[var(--border)] bg-[var(--bg-base)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
              }`}>
              <span
                className={`h-2 w-2 rounded-full ${priority === p ? priorityDot[p] : "bg-[var(--text-muted)]"}`}
              />
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Start & End Date */}
      <div className="flex flex-col md:flex-row gap-4">
        <div
          className="flex-1 rounded-2xl border p-5"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-card)",
          }}>
          <label
            className="mb-1.5 block text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}>
            Start Date *
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[var(--accent)] ${
              submitted && !startDate.trim() ?
                "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
              : "border-[var(--border)] bg-[var(--bg-base)]"
            }`}
            style={{ color: "var(--text-primary)" }}
          />
          {submitted && !startDate.trim() && (
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">
              Start date is required.
            </p>
          )}
        </div>

        <div
          className="flex-1 rounded-2xl border p-5"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-card)",
          }}>
          <label
            className="mb-1.5 block text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}>
            End Date *
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-[var(--accent)] ${
              submitted && !endDate.trim() ?
                "border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/20"
              : "border-[var(--border)] bg-[var(--bg-base)]"
            }`}
            style={{ color: "var(--text-primary)" }}
          />
          {submitted && !endDate.trim() && (
            <p className="mt-1 text-xs text-red-500 dark:text-red-400">
              End date is required.
            </p>
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
      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-card)",
        }}>
        <div className="mb-1.5 flex items-center justify-between">
          <label
            className="block text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}>
            Project Link
          </label>
          <span
            className="rounded-md px-2 py-0.5 text-[10px] font-medium"
            style={{
              backgroundColor: "var(--bg-hover)",
              color: "var(--text-muted)",
            }}>
            Optional
          </span>
        </div>
        <div className="relative">
          <span
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-muted)" }}>
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
            className="w-full rounded-xl border py-2.5 pl-9 pr-3.5 text-sm outline-none transition-colors focus:border-[var(--accent)]"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--bg-base)",
              color: "var(--text-primary)",
              placeholderColor: "var(--text-muted)",
            }}
          />
        </div>
        <p
          className="mt-1.5 text-[11px]"
          style={{ color: "var(--text-muted)" }}>
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

      {/* Cover Image with Cloudinary */}
      <div
        className="rounded-2xl border p-5"
        style={{
          borderColor: "var(--border)",
          backgroundColor: "var(--bg-card)",
        }}>
        <div className="mb-3 flex items-center justify-between">
          <label
            className="block text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}>
            Cover Image
          </label>
          <span
            className="rounded-md px-2 py-0.5 text-[10px] font-medium"
            style={{
              backgroundColor: "var(--bg-hover)",
              color: "var(--text-muted)",
            }}>
            Optional
          </span>
        </div>

        {imageUrl && (
          <div
            className="mb-3 w-full overflow-hidden rounded-xl border"
            style={{
              height: "180px",
              borderColor: "var(--border)",
              backgroundColor: "var(--bg-base)",
            }}>
            <img
              src={imageUrl}
              alt="Cover preview"
              className="h-full w-full object-contain"
            />
          </div>
        )}

        <CloudinaryUpload
          onUpload={onImageUrlChange}
          currentImageUrl={imageUrl}
          buttonText={imageUrl ? "Change Image" : "Upload Project Image"}
        />

        <p className="mt-2 text-[11px]" style={{ color: "var(--text-muted)" }}>
          PNG, JPG, WEBP · Images are stored in Cloudinary
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pb-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border py-3 text-sm font-medium transition-colors"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-card)",
            color: "var(--text-secondary)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.backgroundColor = "var(--bg-accent-soft)";
            e.currentTarget.style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.backgroundColor = "var(--bg-card)";
            e.currentTarget.style.color = "var(--text-secondary)";
          }}>
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || redirecting}
          className="flex-1 rounded-xl py-3 text-sm font-semibold text-white transition-colors active:scale-[0.987] disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "var(--accent)",
          }}
          onMouseEnter={(e) => {
            if (!loading && !redirecting) {
              e.currentTarget.style.backgroundColor = "var(--accent-hover)";
            }
          }}
          onMouseLeave={(e) => {
            if (!loading && !redirecting) {
              e.currentTarget.style.backgroundColor = "var(--accent)";
            }
          }}>
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
