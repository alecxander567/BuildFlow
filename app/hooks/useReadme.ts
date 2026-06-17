"use client";

import { useCallback, useState } from "react";
import type { Priority, ProjectType } from "@/app/components/ProjectCard";

export interface ReadmeProjectInfo {
  title: string;
  description?: string;
  projectType: ProjectType;
  priority: Priority;
  startDate?: string | null;
  endDate?: string | null;
  projectUrl?: string;
}

function slugify(title: string) {
  return (
    title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-") || "project"
  );
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Builds the README markdown from project info + a manually entered tech
 * stack. Pure template, no API call — instant and deterministic.
 */
function buildReadmeMarkdown(
  project: ReadmeProjectInfo,
  techStack: string[],
): string {
  const {
    title,
    description,
    projectType,
    priority,
    startDate,
    endDate,
    projectUrl,
  } = project;

  const lines: string[] = [];

  lines.push(`# ${title || "Untitled Project"}`);
  lines.push("");

  if (description?.trim()) {
    lines.push(description.trim());
    lines.push("");
  }

  lines.push("## Overview");
  lines.push("");
  lines.push(`- **Type:** ${projectType || "Others"}`);
  lines.push(`- **Priority:** ${priority}`);
  const start = formatDate(startDate);
  const end = formatDate(endDate);
  if (start || end) {
    lines.push(`- **Timeline:** ${start ?? "TBD"} – ${end ?? "TBD"}`);
  }
  if (projectUrl?.trim()) {
    lines.push(`- **Link:** ${projectUrl.trim()}`);
  }
  lines.push("");

  lines.push("## Tech Stack");
  lines.push("");
  if (techStack.length > 0) {
    for (const tech of techStack) {
      lines.push(`- ${tech}`);
    }
  } else {
    lines.push("_No tech stack specified yet._");
  }
  lines.push("");

  lines.push("## Getting Started");
  lines.push("");
  lines.push("```bash");
  lines.push("# Clone the repository");
  lines.push("git clone <repository-url>");
  lines.push("");
  lines.push("# Install dependencies");
  lines.push("npm install");
  lines.push("");
  lines.push("# Run the project");
  lines.push("npm run dev");
  lines.push("```");
  lines.push("");

  lines.push("---");
  lines.push("");
  lines.push(
    `_Generated on ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}_`,
  );
  lines.push("");

  return lines.join("\n");
}

export function useReadme(project: ReadmeProjectInfo) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [content, setContent] = useState<string>("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle",
  );

  const openForm = useCallback(() => setIsFormOpen(true), []);
  const closeForm = useCallback(() => setIsFormOpen(false), []);
  const closePreview = useCallback(() => {
    setIsPreviewOpen(false);
    setCopyState("idle");
  }, []);

  const generate = useCallback(
    (techStack: string[]) => {
      const markdown = buildReadmeMarkdown(project, techStack);
      setContent(markdown);
      setIsFormOpen(false);
      setIsPreviewOpen(true);
    },
    [project],
  );

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("error");
      setTimeout(() => setCopyState("idle"), 2000);
    }
  }, [content]);

  const download = useCallback(() => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slugify(project.title)}-README.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [content, project.title]);

  return {
    isFormOpen,
    isPreviewOpen,
    content,
    copyState,
    openForm,
    closeForm,
    closePreview,
    generate,
    copy,
    download,
  };
}
