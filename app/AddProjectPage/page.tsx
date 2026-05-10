"use client";

import { useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";
import {
  useProjects,
  type Priority,
  type ProjectType,
  type DailyPlan,
} from "@/app/hooks/useProject";
import { useAuth } from "@/app/hooks/useAuth";
import { useUserTools } from "@/app/hooks/useUserTools";
import ProjectFormFields from "../components/ProjectFormFields";
import { useEffect } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

export default function AddProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, authLoading } = useAuth();
  const { projects, addProject, updateProject, loading } = useProjects(
    user,
    authLoading,
  );

  // userTools = permanent catalog belonging to the user, not any single project
  // loaded = true once Firestore has responded (even if the doc doesn't exist yet)
  const { userTools, saveUserTools, loaded: toolsLoaded } = useUserTools(user);

  const editProjectId = searchParams.get("edit");
  const isEditMode = Boolean(editProjectId);
  const target =
    isEditMode ? projects.find((p) => p.id === editProjectId) : null;

  // Don't show the form until auth, projects, AND the tool catalog are all ready.
  const isReady =
    !authLoading &&
    !loading &&
    toolsLoaded &&
    (!isEditMode || target !== undefined);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState<ProjectType>("Technology");
  const [priority, setPriority] = useState<Priority>("Moderate");
  const [projectUrl, setProjectUrl] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedTools, setSelectedTools] = useState<Record<string, string[]>>(
    {},
  );
  const [dailyPlan, setDailyPlan] = useState<DailyPlan>({});
  const [submitted, setSubmitted] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  // Add local catalog state to manage updates
  const [localCatalog, setLocalCatalog] = useState<Record<string, string[]>>(
    {},
  );

  // Sync local catalog with userTools from Firebase
  useEffect(() => {
    if (toolsLoaded) {
      setLocalCatalog(userTools);
    }
  }, [userTools, toolsLoaded]);

  // Seed form fields from the project document once, when edit mode is ready
  const seededRef = useRef(false);
  useEffect(() => {
    if (!isReady || seededRef.current) return;
    seededRef.current = true;

    if (isEditMode && target) {
      setTitle(target.title ?? "");
      setDescription(target.description ?? "");
      setProjectType(target.projectType ?? "Technology");
      setPriority(target.priority ?? "Moderate");
      setProjectUrl(target.projectUrl ?? "");
      setStartDate(target.startDate ?? "");
      setEndDate(target.endDate ?? "");
      setSelectedTools(target.selectedTools ?? {});
      setDailyPlan(target.dailyPlan ?? {});
      setImageUrl(target.imageUrl ?? "");
    }
  }, [isReady, isEditMode, target]);

  // When the user adds/removes categories or tools from the catalog,
  // save it back to userTools/{uid} immediately so it persists across all projects.
  const handleCatalogChange = (updatedCatalog: Record<string, string[]>) => {
    setLocalCatalog(updatedCatalog);
    saveUserTools(updatedCatalog);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!title.trim() || !startDate.trim() || !endDate.trim()) return;

    if (isEditMode && editProjectId) {
      await updateProject(editProjectId, {
        title: title.trim(),
        description: description.trim(),
        projectType,
        priority,
        projectUrl: projectUrl.trim(),
        startDate: startDate || null,
        endDate: endDate || null,
        selectedTools,
        dailyPlan,
        imageUrl,
      });
      sessionStorage.setItem(
        "pendingToast",
        JSON.stringify({
          type: "success",
          title: "Project updated!",
          message: `"${title.trim()}" has been updated.`,
        }),
      );
      setRedirecting(true);
      router.push("/dashboard");
      return;
    }

    const success = await addProject({
      title: title.trim(),
      description: description.trim(),
      projectType,
      priority,
      imageUrl: imageUrl,
      projectUrl: projectUrl.trim(),
      startDate: startDate || null,
      endDate: endDate || null,
      progress: 0,
      selectedTools,
      dailyPlan,
    });

    if (!success) {
      sessionStorage.setItem(
        "pendingToast",
        JSON.stringify({
          type: "error",
          title: "Failed to create project",
          message: "Something went wrong. Please try again.",
        }),
      );
      router.push("/dashboard");
      return;
    }

    sessionStorage.setItem(
      "pendingToast",
      JSON.stringify({
        type: "success",
        title: "Project created!",
        message: `"${title.trim()}" has been added to your projects.`,
      }),
    );
    setRedirecting(true);
    router.push("/dashboard");
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        backgroundColor: "var(--bg-base)",
        fontFamily: "'DM Sans', sans-serif",
      }}>
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden pt-[53px] md:pt-0">
        <div className="hidden md:block">
          <TopBar />
        </div>

        {/* Mobile search bar */}
        <div
          className="md:hidden border-b px-4 pt-4 pb-3"
          style={{
            borderColor: "var(--border)",
            backgroundColor: "var(--bg-card)",
          }}>
          <div className="relative w-full">
            <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "var(--text-muted)" }}>
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search projects, tasks…"
              className="w-full rounded-xl border py-2 pl-9 pr-4 text-sm outline-none transition-colors"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-base)",
                color: "var(--text-primary)",
                placeholderColor: "var(--text-muted)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.backgroundColor = "var(--bg-card)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.backgroundColor = "var(--bg-base)";
              }}
            />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 md:px-8 md:py-7">
          <div className="mx-auto max-w-2xl">
            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex h-9 w-9 items-center justify-center rounded-xl border transition-colors"
                style={{
                  borderColor: "var(--border)",
                  backgroundColor: "var(--bg-card)",
                  color: "var(--text-secondary)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.backgroundColor =
                    "var(--bg-accent-soft)";
                  e.currentTarget.style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.backgroundColor = "var(--bg-card)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <div>
                <h1
                  className="text-lg font-bold"
                  style={{
                    color: "var(--text-primary)",
                    fontFamily: "'Sora', sans-serif",
                  }}>
                  {isEditMode ? "Edit Project" : "New Project"}
                </h1>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {isEditMode ?
                    "Update the details below to edit your project"
                  : "Fill in the details below to create a project"}
                </p>
              </div>
            </div>

            {!isReady ?
              // Replaced inline skeleton divs with LoadingSpinner
              <LoadingSpinner
                variant="spinner"
                size="md"
                label="Loading…"
                fullScreen
              />
            : <form
                key={editProjectId ?? "new"}
                onSubmit={handleSubmit}
                className="flex flex-col gap-4">
                <ProjectFormFields
                  title={title}
                  description={description}
                  projectType={projectType}
                  priority={priority}
                  projectUrl={projectUrl}
                  startDate={startDate}
                  endDate={endDate}
                  submitted={submitted}
                  onTitleChange={setTitle}
                  onDescriptionChange={setDescription}
                  onProjectTypeChange={setProjectType}
                  onPriorityChange={setPriority}
                  onProjectUrlChange={setProjectUrl}
                  onStartDateChange={setStartDate}
                  onEndDateChange={setEndDate}
                  dailyPlan={dailyPlan}
                  onDailyPlanChange={setDailyPlan}
                  // Use localCatalog instead of userTools directly
                  catalog={localCatalog}
                  onCatalogChange={handleCatalogChange}
                  // Only the selections for THIS project
                  selectedTools={selectedTools}
                  onSelectedToolsChange={setSelectedTools}
                  imageUrl={imageUrl}
                  onImageUrlChange={setImageUrl}
                  isEditMode={isEditMode}
                  loading={loading}
                  redirecting={redirecting}
                  onCancel={() => router.push("/dashboard")}
                />
              </form>
            }
          </div>
        </main>
      </div>

      {/* Replaced inline redirect overlay with LoadingSpinner */}
      {redirecting && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center backdrop-blur-sm"
          style={{ backgroundColor: "var(--bg-base)/80" }}>
          <LoadingSpinner
            variant="spinner"
            size="lg"
            label="Redirecting to dashboard…"
          />
        </div>
      )}
    </div>
  );
}
