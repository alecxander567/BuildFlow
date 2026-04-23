"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";
import {
  useProjects,
  type Priority,
  type ProjectType,
} from "@/app/hooks/useProject";
import { useAuth } from "@/app/hooks/useAuth";
import ProjectFormFields from "../components/ProjectFormFields";

export default function AddProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, authLoading } = useAuth();
  const { projects, addProject, updateProject, loading } = useProjects(
    user,
    authLoading,
  );
  const editProjectId = searchParams.get("edit");
  const isEditMode = Boolean(editProjectId);

  const target =
    isEditMode ? projects.find((p) => p.id === editProjectId) : null;

  const [title, setTitle] = useState(target?.title ?? "");
  const [description, setDescription] = useState(target?.description ?? "");
  const [projectType, setProjectType] = useState<ProjectType>(
    target?.projectType ?? "Technology",
  );
  const [priority, setPriority] = useState<Priority>(
    target?.priority ?? "Moderate",
  );
  const [projectUrl, setProjectUrl] = useState(target?.projectUrl ?? "");
  const [submitted, setSubmitted] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!isEditMode || !editProjectId) return;
    if (!projects.length) return;

    const target = projects.find((p) => p.id === editProjectId);
    if (!target) return;

    setTitle(target.title ?? "");
    setDescription(target.description ?? "");
    setProjectType(target.projectType);
    setPriority(target.priority);
    setProjectUrl(target.projectUrl ?? "");
  }, [projects, isEditMode, editProjectId]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    if (!title.trim()) return;

    if (isEditMode && editProjectId) {
      await updateProject(editProjectId, {
        title: title.trim(),
        description: description.trim(),
        projectType,
        priority,
        projectUrl: projectUrl.trim(),
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
      imageUrl: "",
      projectUrl: projectUrl.trim(),
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
      className="flex h-screen overflow-hidden bg-[#F9F7F4]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden pt-[53px] md:pt-0">
        <div className="hidden md:block">
          <TopBar />
        </div>

        <div className="md:hidden border-b border-[#EDE8E2] bg-white px-4 pt-4 pb-3">
          <div className="relative w-full">
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
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search projects, tasks…"
              className="w-full rounded-xl border border-[#E8E4DE] bg-[#F9F7F4] py-2 pl-9 pr-4 text-sm text-[#1A1916] placeholder:text-[#B0ADA7] outline-none focus:border-[#E8610A] focus:bg-white"
            />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 md:px-8 md:py-7">
          <div className="mx-auto max-w-2xl">
            <div className="mb-6 flex items-center gap-3">
              <button
                onClick={() => router.back()}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EDE8E2] bg-white text-[#72706A] transition-colors hover:border-[#F5C89A] hover:bg-[#FEF0E7] hover:text-[#E8610A]">
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
                  className="text-lg font-bold text-[#1A1916]"
                  style={{ fontFamily: "'Sora', sans-serif" }}>
                  {isEditMode ? "Edit Project" : "New Project"}
                </h1>
                <p className="text-xs text-[#B0ADA7]">
                  {isEditMode ?
                    "Update the details below to edit your project"
                  : "Fill in the details below to create a project"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <ProjectFormFields
                title={title}
                description={description}
                projectType={projectType}
                priority={priority}
                projectUrl={projectUrl}
                submitted={submitted}
                onTitleChange={setTitle}
                onDescriptionChange={setDescription}
                onProjectTypeChange={setProjectType}
                onPriorityChange={setPriority}
                onProjectUrlChange={setProjectUrl}
              />

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
                        PNG, JPG, WEBP · Max 10MB · Will be uploaded to
                        Cloudinary
                      </p>
                    </div>
                  </button>
                }
              </div>

              <div className="flex gap-3 pb-6">
                <button
                  type="button"
                  onClick={() => router.back()}
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
            </form>
          </div>
        </main>
      </div>

      {redirecting && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-[#F9F7F4]/80 backdrop-blur-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FEF0E7]">
            <svg
              className="animate-spin"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#E8610A"
              strokeWidth="2.5"
              strokeLinecap="round">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
          </div>
          <p
            className="text-sm font-medium text-[#72706A]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}>
            Redirecting to dashboard…
          </p>
        </div>
      )}
    </div>
  );
}
