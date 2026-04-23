"use client";

import { type Priority, type ProjectType } from "@/app/hooks/useProject";

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
}: Props) {
  return (
    <>
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
    </>
  );
}
