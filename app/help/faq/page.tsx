// app/help/faq/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Sidebar from "@/app/components/Sidebar";
import TopBar from "@/app/components/Topbar";

const faqs = [
  {
    category: "Account",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    items: [
      {
        q: "How do I create an account?",
        a: "Go to /signup and enter your email address, a password (minimum 6 characters), and confirm your password. You can also sign up instantly using Google or GitHub.",
      },
      {
        q: "How is my display name set?",
        a: "Your display name is automatically generated from your email address when you sign up. You can update it later from your account settings.",
      },
      {
        q: "Can I sign up without an email?",
        a: "Yes — you can sign up instantly using your Google or GitHub account without needing to enter an email and password manually.",
      },
    ],
  },
  {
    category: "Projects",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
      </svg>
    ),
    items: [
      {
        q: "How do I create a project?",
        a: 'From your dashboard, click the "+ New Project" button and fill in the project name, type, priority, and optional details like description, image URL, project URL, and start and end dates.',
      },
      {
        q: "How is project progress calculated?",
        a: "Progress is calculated automatically based on the tasks you complete in your daily plan. The more tasks you add and check off, the higher your project progress percentage.",
      },
      {
        q: "What project types are available?",
        a: "You can set your project type to Engineering, Research, Business, or any custom type that fits your workflow.",
      },
      {
        q: "What are the priority levels for a project?",
        a: "Projects can be set to High, Moderate, or Low priority. This helps you stay organized and focus on what matters most.",
      },
    ],
  },
  {
    category: "Tool Hub",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    items: [
      {
        q: "What is the Tool Hub?",
        a: "The Tool Hub is your personal tool catalog. You can organize tools into custom categories and link them to your projects. There are no preset integrations — you build it yourself.",
      },
      {
        q: "How do I add a tool?",
        a: 'Navigate to Tool Hub in the sidebar, open a category, then click "Add Tool" and enter the tool name. You can rename or delete tools and categories at any time.',
      },
      {
        q: "How do tools connect to my projects?",
        a: "When creating or editing a project, you can select tools from your Tool Hub via the selectedTools field. This links your tools to specific projects.",
      },
      {
        q: "Do tools count toward achievements?",
        a: "Yes — each unique tool you add to your Tool Hub counts toward your achievements.",
      },
    ],
  },
  {
    category: "Analytics",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
    items: [
      {
        q: "What does the Analytics page show?",
        a: "Analytics shows your productivity metrics (total, completed, in-progress, and not-started projects), task completion rate, productivity score, tool usage breakdown by category, and achievement stats.",
      },
      {
        q: "How is the productivity score calculated?",
        a: "The productivity score is a weighted metric: 40% project completion rate, 30% task completion rate, 20% project volume, and 10% achievements unlocked.",
      },
      {
        q: "Can I filter analytics by time?",
        a: "Yes — you can filter your analytics data by all time, last month, or last week using the time range filter at the top of the Analytics page.",
      },
      {
        q: "Why is my tool analytics empty?",
        a: "Tool analytics is based on the selectedTools linked to your projects. If you haven't linked any tools to your projects yet, the breakdown will be empty.",
      },
    ],
  },
  {
    category: "AI Chatbot",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    items: [
      {
        q: "Where do I find the AI chatbot?",
        a: "Click the chat icon in the bottom-right corner of any page to open the AI assistant.",
      },
      {
        q: "What can the AI chatbot help me with?",
        a: 'The chatbot can help you manage your projects, plan tasks, answer questions about BuildFlow, and more. Try asking things like "Can you help me plan my current project?" or "How do I add team members?"',
      },
    ],
  },
];

function AccordionItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="border-b last:border-b-0"
      style={{ borderColor: "var(--border)" }}>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm font-medium"
        style={{ color: "var(--text-primary)" }}>
        <span>{q}</span>
        <span
          className="shrink-0 transition-transform duration-200"
          style={{
            color: "var(--accent)",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>
      {open && (
        <p
          className="pb-4 text-sm leading-relaxed"
          style={{ color: "var(--text-secondary)" }}>
          {a}
        </p>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{
        backgroundColor: "var(--bg-base)",
        fontFamily: "'DM Sans', sans-serif",
      }}>
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden pt-[53px] md:pt-0">
        <TopBar />

        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 md:px-8 md:py-7">
          <div className="mx-auto max-w-3xl flex flex-col gap-5 md:gap-7">
            {/* Breadcrumb */}
            <div
              className="flex items-center gap-2 text-sm"
              style={{ color: "var(--text-muted)" }}>
              <Link
                href="/help"
                className="transition-colors hover:underline"
                style={{ color: "var(--text-muted)" }}>
                Help
              </Link>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span style={{ color: "var(--text-primary)" }}>FAQ</span>
            </div>

            {/* Header */}
            <div>
              <div
                className="mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-widest"
                style={{
                  backgroundColor: "var(--bg-accent-soft)",
                  borderColor: "var(--accent)",
                  color: "var(--accent)",
                }}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Frequently Asked
              </div>
              <h1
                className="mb-3 text-3xl font-bold tracking-tight"
                style={{
                  fontFamily: "'Sora', sans-serif",
                  color: "var(--text-primary)",
                }}>
                Frequently Asked Questions
              </h1>
              <p
                className="text-base leading-relaxed"
                style={{ color: "var(--text-secondary)" }}>
                Quick answers to the most common questions about BuildFlow
                &mdash; accounts, projects, tools, analytics, and the AI
                chatbot.
              </p>
            </div>

            {/* FAQ sections */}
            {faqs.map((section) => (
              <section key={section.category}>
                <div className="mb-4 flex items-center gap-2">
                  <span style={{ color: "var(--accent)" }}>{section.icon}</span>
                  <h2
                    className="text-lg font-semibold"
                    style={{
                      fontFamily: "'Sora', sans-serif",
                      color: "var(--text-primary)",
                    }}>
                    {section.category}
                  </h2>
                </div>
                <div
                  className="rounded-xl border px-5"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border)",
                  }}>
                  {section.items.map((item) => (
                    <AccordionItem key={item.q} q={item.q} a={item.a} />
                  ))}
                </div>
              </section>
            ))}

            {/* Still need help */}
            <div
              className="mb-10 rounded-xl border p-5 flex items-start gap-4"
              style={{
                backgroundColor: "var(--bg-accent-soft)",
                borderColor: "var(--accent)",
              }}>
              <span style={{ color: "var(--accent)" }}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </span>
              <div>
                <p
                  className="mb-1 text-sm font-semibold"
                  style={{ color: "var(--text-primary)" }}>
                  Still have questions?
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}>
                  Use the AI chatbot in the bottom-right corner of any page, or
                  visit our{" "}
                  <Link
                    href="/help/getting-started"
                    className="font-medium underline"
                    style={{ color: "var(--accent)" }}>
                    Getting Started guide
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
