// app/hooks/useReportBug.ts
"use client";

import { useState } from "react";

export interface ReportBugForm {
  name: string;
  email: string;
  title: string;
  description: string;
  steps: string;
  expected: string;
  actual: string;
  priority: string;
  browser: string;
  os: string;
  url: string;
}

const defaultForm: ReportBugForm = {
  name: "",
  email: "",
  title: "",
  description: "",
  steps: "",
  expected: "",
  actual: "",
  priority: "medium",
  browser: "",
  os: "",
  url: "",
};

export type SubmitStatus = "idle" | "loading" | "success" | "error";

export function useReportBug() {
  const [formData, setFormData] = useState<ReportBugForm>(defaultForm);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/report-bug", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send report");
      }

      setStatus("success");
      setFormData(defaultForm);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong",
      );
    }
  };

  const reset = () => {
    setStatus("idle");
    setErrorMessage("");
  };

  return {
    formData,
    status,
    errorMessage,
    handleChange,
    handleSubmit,
    reset,
  };
}
