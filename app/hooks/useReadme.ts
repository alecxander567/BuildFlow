import { useState } from "react";

export interface ReadmeData {
  title: string;
  description?: string;
  projectType: string;
  priority: string;
  projectUrl?: string;
}

export function useReadme(projectData: ReadmeData) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [content, setContent] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  const generate = ({
    tools,
    resources = [],
  }: {
    tools: Record<string, string[]>;
    resources?: string[];
  }) => {
    const allTools = Object.values(tools).flat();

    // Build the summary content with better formatting
    let summary = `# 📋 ${projectData.title}\n\n`;

    // Separator
    summary += `---\n\n`;

    // Description
    if (projectData.description) {
      summary += `## 📝 Description\n\n`;
      summary += `${projectData.description}\n\n`;
    }

    // Project Details
    summary += `## 📊 Project Details\n\n`;
    summary += `| Attribute | Value |\n`;
    summary += `|-----------|-------|\n`;
    summary += `| **Type** | ${projectData.projectType} |\n`;
    summary += `| **Priority** | ${projectData.priority} |\n`;
    if (projectData.projectUrl) {
      summary += `| **URL** | [${projectData.projectUrl}](${projectData.projectUrl}) |\n`;
    }
    summary += `\n`;

    // Tools Used
    if (allTools.length > 0) {
      summary += `## 🛠️ Tools & Technologies\n\n`;

      // Check if tools are grouped by category
      const hasCategories = Object.keys(tools).some(
        (key) => tools[key].length > 0,
      );

      if (hasCategories && Object.keys(tools).length > 1) {
        // Grouped by category
        Object.entries(tools).forEach(([category, toolList]) => {
          if (toolList.length > 0) {
            summary += `### ${category}\n\n`;
            toolList.forEach((tool) => {
              summary += `- ${tool}\n`;
            });
            summary += `\n`;
          }
        });
      } else {
        // Flat list
        summary += `| Tool |\n`;
        summary += `|------|\n`;
        allTools.forEach((tool) => {
          summary += `| ${tool} |\n`;
        });
        summary += `\n`;
      }
    }

    // Resources (if any)
    if (resources.length > 0) {
      summary += `## 📚 Resources\n\n`;
      resources.forEach((resource) => {
        summary += `- ${resource}\n`;
      });
      summary += `\n`;
    }

    // Footer
    summary += `---\n\n`;
    summary += `*📅 Generated on ${new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}*\n`;

    setContent(summary);
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
    setCopyState("idle");
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const download = () => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectData.title.replace(/\s+/g, "_")}_summary.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    content,
    isPreviewOpen,
    copyState,
    generate,
    closePreview,
    copy,
    download,
  };
}
