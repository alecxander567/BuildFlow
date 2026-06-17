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

    // Build the summary content
    let summary = `# ${projectData.title}\n\n`;

    // Description
    if (projectData.description) {
      summary += `## Description\n\n${projectData.description}\n\n`;
    }

    // Project Type & Priority
    summary += `## Project Details\n\n`;
    summary += `- **Type:** ${projectData.projectType}\n`;
    summary += `- **Priority:** ${projectData.priority}\n`;

    // Project URL
    if (projectData.projectUrl) {
      summary += `- **URL:** ${projectData.projectUrl}\n`;
    }

    summary += `\n`;

    // Tools Used
    if (allTools.length > 0) {
      summary += `## Tools Used\n\n`;
      summary += `| Tool |\n`;
      summary += `|------|\n`;
      allTools.forEach((tool) => {
        summary += `| ${tool} |\n`;
      });
      summary += `\n`;
    }

    // Resources (if any)
    if (resources.length > 0) {
      summary += `## Resources\n\n`;
      resources.forEach((resource) => {
        summary += `- ${resource}\n`;
      });
      summary += `\n`;
    }

    summary += `---\n\n`;
    summary += `*Summary generated on ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}*`;

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
