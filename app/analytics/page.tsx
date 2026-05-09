"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/Topbar";
import { AlertContainer, useAlert } from "../components/Alert";
import { useAnalytics, TimeRange } from "@/app/hooks/useAnalytics";
import type { CategoryStats } from "@/app/hooks/useAnalytics";

// ── Recharts can't consume CSS variables, so we keep JS constants.
// These are theme-independent brand colors (orange stays orange in dark).
const ORANGE = "#E8610A";
const ORANGE_LIGHT = "#F07D2E";
const ORANGE_MUTED = "#FEF0E7"; // used only as chart fill — acceptable in dark
const PIE_COLORS = ["#E8610A", "#F07D2E", "#F5A05C", "#F9C496", "#FDE2C8"];

// Chart axis / tooltip colors — these DO change per theme.
// We read from :root / .dark at runtime via a small helper.
function getCSSVar(name: string) {
  if (typeof window === "undefined") return "#000";
  return getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
}

function ProgressBar({
  value,
  thin = false,
}: {
  value: number;
  thin?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-full bg-[var(--bg-hover)] ${thin ? "h-1.5" : "h-2.5"}`}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#E8610A] to-[#F5A05C] transition-all duration-700"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

function ProjectStatusChart({
  completed,
  inProgress,
  notStarted,
}: {
  completed: number;
  inProgress: number;
  notStarted: number;
}) {
  const data = [
    { name: "Completed", value: completed },
    { name: "In Progress", value: inProgress },
    { name: "Not Started", value: notStarted },
  ].filter((d) => d.value > 0);

  if (!data.length)
    return (
      <p className="text-center text-sm text-[var(--text-muted)] py-6">
        No project data
      </p>
    );

  const STATUS_COLORS = [ORANGE, ORANGE_LIGHT, ORANGE_MUTED];

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value">
          {data.map((_, i) => (
            <Cell key={i} fill={STATUS_COLORS[i]} stroke="none" />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            borderRadius: 10,
            border: `1px solid ${getCSSVar("--border")}`,
            background: getCSSVar("--bg-card"),
            color: getCSSVar("--text-primary"),
            fontSize: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, color: getCSSVar("--text-secondary") }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function TopToolsChart({
  tools,
}: {
  tools: { name: string; count: number }[];
}) {
  if (!tools.length)
    return (
      <p className="text-center text-sm text-[var(--text-muted)] py-6">
        No tool usage data
      </p>
    );

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart
        data={tools}
        layout="vertical"
        margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={false}
          stroke={getCSSVar("--border")}
        />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: getCSSVar("--text-secondary") }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11, fill: getCSSVar("--text-primary") }}
          tickLine={false}
          axisLine={false}
          width={80}
        />
        <Tooltip
          cursor={{ fill: ORANGE_MUTED }}
          contentStyle={{
            borderRadius: 10,
            border: `1px solid ${getCSSVar("--border")}`,
            background: getCSSVar("--bg-card"),
            color: getCSSVar("--text-primary"),
            fontSize: 12,
          }}
        />
        <Bar dataKey="count" fill={ORANGE} radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function CategoryBreakdown({ categories }: { categories: CategoryStats[] }) {
  if (!categories.length)
    return (
      <p className="text-center text-sm text-[var(--text-muted)] py-6">
        No data
      </p>
    );

  return (
    <div className="space-y-5">
      {categories.map((cat) => (
        <div key={cat.category}>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-semibold text-[var(--text-primary)]">
              {cat.category}
            </span>
            <span className="text-[var(--text-secondary)]">
              {cat.totalUsage} uses · {cat.percentage.toFixed(1)}%
            </span>
          </div>
          <ProgressBar value={cat.percentage} />
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
            {cat.tools.slice(0, 4).map((tool) => (
              <div
                key={tool.name}
                className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <span className="truncate">{tool.name}</span>
                <span className="ml-2 font-semibold text-[var(--accent)] flex-shrink-0">
                  {tool.count}×
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function AchievementArc({
  unlocked,
  total,
  points,
}: {
  unlocked: number;
  total: number;
  points: number;
}) {
  const pct = total > 0 ? (unlocked / total) * 100 : 0;
  const data = [{ value: pct, fill: ORANGE }];
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative">
        <RadialBarChart
          width={130}
          height={130}
          innerRadius={42}
          outerRadius={58}
          data={data}
          startAngle={210}
          endAngle={210 - (pct / 100) * 240}>
          <RadialBar
            dataKey="value"
            cornerRadius={6}
            background={{ fill: ORANGE_MUTED }}
          />
        </RadialBarChart>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-2xl font-black text-[var(--accent)] leading-none">
            {unlocked}
          </p>
          <p className="text-xs text-[var(--text-secondary)]">of {total}</p>
        </div>
      </div>
      <p className="text-sm font-bold text-[var(--text-primary)]">
        {points} pts
      </p>
    </div>
  );
}

function StatPill({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl px-3 py-2.5 flex flex-col gap-0.5 min-w-0 ${
        accent ?
          "bg-[var(--bg-accent-soft)] border border-[var(--accent)]/30"
        : "bg-[var(--bg-base)] border border-[var(--border)]"
      }`}>
      <span className="text-[10px] text-[var(--text-secondary)] font-medium truncate">
        {label}
      </span>
      <span
        className={`text-lg font-black leading-none ${accent ? "text-[var(--accent)]" : "text-[var(--text-primary)]"}`}>
        {value}
      </span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="w-1.5 h-5 rounded-full bg-[var(--accent)] inline-block flex-shrink-0" />
      <h2
        style={{ fontFamily: "'Sora', sans-serif" }}
        className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-widest">
        {children}
      </h2>
    </div>
  );
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-5 ${className}`}>
      {children}
    </div>
  );
}

function OverviewBox({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`p-5 ${className}`}>{children}</div>;
}

function CardLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-4">
      {children}
    </p>
  );
}

export default function AnalyticsPage() {
  const { toasts, remove } = useAlert();
  const {
    timeRange,
    setTimeRange,
    selectedCategory,
    setSelectedCategory,
    isLoading,
    productivityMetrics,
    toolAnalytics,
    productivityScore,
    mostUsedTool,
    totalPoints,
    unlockedCount,
    totalAchievements,
  } = useAnalytics();

  if (isLoading) {
    return (
      <div
        className="flex h-screen overflow-hidden bg-[var(--bg-base)]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden pt-[53px] md:pt-0">
          <TopBar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent" />
              <p className="mt-2 text-sm text-[var(--text-secondary)]">
                Loading analytics…
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  const visibleCategories =
    selectedCategory === null ?
      toolAnalytics.categories
    : toolAnalytics.categories.filter((c) => c.category === selectedCategory);

  interface TopToolsDisplay {
    isMultiple: boolean;
    percentage: number;
    tools?: {
      name: string;
      count: number;
      category: string;
      percentage: number;
    }[];
    tool?: {
      name: string;
      count: number;
      category: string;
      percentage: number;
    };
  }

  const getTopToolsDisplay = (): TopToolsDisplay | null => {
    if (!toolAnalytics.topTools.length) return null;
    const topPercentage = toolAnalytics.topTools[0].percentage;
    const ties = toolAnalytics.topTools.filter(
      (t) => t.percentage === topPercentage,
    );
    if (ties.length > 1)
      return { isMultiple: true, tools: ties, percentage: topPercentage };
    return {
      isMultiple: false,
      tool: toolAnalytics.topTools[0],
      percentage: topPercentage,
    };
  };

  const topToolsDisplay = getTopToolsDisplay();

  return (
    <div
      className="flex h-screen overflow-hidden bg-[var(--bg-base)]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden pt-[53px] md:pt-0">
        <TopBar />

        <main className="flex-1 overflow-y-auto">
          {/* ── Page header ── */}
          <div className="sticky top-0 z-10 border-b border-[var(--border)] bg-[var(--bg-base)]/90 backdrop-blur-sm px-4 sm:px-6 md:px-10 py-3">
            <div className="mx-auto max-w-6xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-[var(--accent)] inline-block" />
                <h1
                  style={{ fontFamily: "'Sora', sans-serif" }}
                  className="text-[11px] font-bold text-[var(--text-primary)] uppercase tracking-widest">
                  Analytics
                </h1>
              </div>
              <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--bg-card)] p-0.5">
                {(["all", "month", "week"] as TimeRange[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                      timeRange === r ?
                        "bg-[var(--accent)] text-white"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}>
                    {r === "all" ?
                      "All Time"
                    : r === "month" ?
                      "Month"
                    : "Week"}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Content ── */}
          <div className="px-4 py-7 sm:px-6 md:px-10">
            <div className="mx-auto max-w-6xl space-y-10">
              {/* ── Row A: Project Overview ── */}
              <section>
                <SectionLabel>Project Overview</SectionLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Productivity score */}
                  <OverviewBox className="flex flex-col items-center justify-center gap-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border)]">
                    <CardLabel>Productivity Score</CardLabel>
                    {(() => {
                      const score = productivityScore;
                      const data = [
                        { name: "Score", value: score, fill: ORANGE },
                      ];
                      return (
                        <div className="relative flex items-center justify-center">
                          <RadialBarChart
                            width={140}
                            height={140}
                            innerRadius={50}
                            outerRadius={66}
                            data={data}
                            startAngle={90}
                            endAngle={90 - (score / 100) * 360}>
                            <RadialBar
                              dataKey="value"
                              cornerRadius={10}
                              background={{ fill: ORANGE_MUTED }}
                            />
                          </RadialBarChart>
                          <div className="absolute text-center pointer-events-none">
                            <p className="text-3xl font-black text-[var(--accent)] leading-none">
                              {score}
                            </p>
                            <p className="text-xs text-[var(--text-muted)] mt-1">
                              / 100
                            </p>
                          </div>
                        </div>
                      );
                    })()}
                    <div className="text-center">
                      <p className="text-xs font-medium text-[var(--text-secondary)]">
                        Based on {productivityMetrics.totalProjects} project
                        {productivityMetrics.totalProjects !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </OverviewBox>

                  {/* Completion rates */}
                  <OverviewBox className="flex flex-col bg-[var(--bg-card)] rounded-2xl border border-[var(--border)]">
                    <CardLabel>Completion Rates</CardLabel>
                    <div className="flex-1 flex flex-col justify-center gap-5">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-[var(--text-primary)]">
                            Project Completion
                          </span>
                          <span className="text-sm font-black text-[var(--accent)]">
                            {productivityMetrics.projectCompletionRate}%
                          </span>
                        </div>
                        <ProgressBar
                          value={productivityMetrics.projectCompletionRate}
                        />
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <div className="text-center">
                            <p className="text-[10px] text-[var(--text-secondary)]">
                              Completed
                            </p>
                            <p className="text-base font-black text-[var(--text-primary)]">
                              {productivityMetrics.completedProjects}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-[var(--text-secondary)]">
                              Total
                            </p>
                            <p className="text-base font-black text-[var(--text-primary)]">
                              {productivityMetrics.totalProjects}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-[var(--text-primary)]">
                            Task Completion
                          </span>
                          <span className="text-sm font-black text-[var(--accent)]">
                            {productivityMetrics.taskCompletionRate}%
                          </span>
                        </div>
                        <ProgressBar
                          value={productivityMetrics.taskCompletionRate}
                        />
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <div className="text-center">
                            <p className="text-[10px] text-[var(--text-secondary)]">
                              Completed
                            </p>
                            <p className="text-base font-black text-[var(--text-primary)]">
                              {productivityMetrics.completedTasks}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-[var(--text-secondary)]">
                              Total
                            </p>
                            <p className="text-base font-black text-[var(--text-primary)]">
                              {productivityMetrics.totalTasks}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </OverviewBox>

                  {/* Status distribution */}
                  <OverviewBox className="flex flex-col bg-[var(--bg-card)] rounded-2xl border border-[var(--border)]">
                    <CardLabel>Status Distribution</CardLabel>
                    <div className="flex-1 flex items-center justify-center">
                      <ProjectStatusChart
                        completed={productivityMetrics.completedProjects}
                        inProgress={productivityMetrics.inProgressProjects}
                        notStarted={productivityMetrics.notStartedProjects}
                      />
                    </div>
                  </OverviewBox>

                  {/* Achievements */}
                  <OverviewBox className="flex flex-col items-center justify-center gap-4 bg-[var(--bg-card)] rounded-2xl border border-[var(--border)]">
                    <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest self-start">
                      Achievements
                    </p>
                    <AchievementArc
                      unlocked={unlockedCount}
                      total={totalAchievements}
                      points={totalPoints}
                    />
                    <div className="w-full pt-3 border-t border-[var(--border)]">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-[var(--text-secondary)]">
                          Completion
                        </span>
                        <span className="font-bold text-[var(--text-primary)]">
                          {totalAchievements > 0 ?
                            `${Math.round((unlockedCount / totalAchievements) * 100)}%`
                          : "0%"}
                        </span>
                      </div>
                      <ProgressBar
                        value={
                          totalAchievements > 0 ?
                            (unlockedCount / totalAchievements) * 100
                          : 0
                        }
                        thin
                      />
                    </div>
                  </OverviewBox>
                </div>
              </section>

              {/* ── Row B: Tool Usage ── */}
              <section>
                <SectionLabel>Tool Usage</SectionLabel>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top 5 tools */}
                  <Card className="flex flex-col transition-all duration-200 hover:shadow-md">
                    <CardLabel>Top 5 Tools</CardLabel>
                    <div className="flex-1">
                      <TopToolsChart tools={toolAnalytics.topTools} />
                    </div>
                  </Card>

                  {/* Favorite tool */}
                  <Card className="flex flex-col transition-all duration-200 hover:shadow-md">
                    <CardLabel>Favorite Tool</CardLabel>
                    {topToolsDisplay ?
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center gap-4 mb-5">
                          <div className="flex-shrink-0 h-12 w-12 rounded-2xl bg-gradient-to-br from-[#E8610A] to-[#F5A05C] flex items-center justify-center">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="white"
                              strokeWidth="1.75">
                              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                            </svg>
                          </div>
                          <div>
                            {(
                              topToolsDisplay.isMultiple &&
                              topToolsDisplay.tools
                            ) ?
                              <>
                                <p className="text-base font-black text-[var(--text-primary)] leading-tight">
                                  {topToolsDisplay.tools
                                    .map((t) => t.name)
                                    .join(" & ")}
                                </p>
                                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                                  Multiple favorites
                                </p>
                              </>
                            : topToolsDisplay.tool ?
                              <>
                                <p className="text-base font-black text-[var(--text-primary)] leading-tight">
                                  {topToolsDisplay.tool.name}
                                </p>
                                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                                  {topToolsDisplay.tool.category}
                                </p>
                              </>
                            : null}
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center bg-[var(--bg-accent-soft)] rounded-xl py-6 mb-4">
                          <p className="text-5xl font-black text-[var(--accent)] leading-none">
                            {topToolsDisplay.percentage.toFixed(0)}
                            <span className="text-2xl">%</span>
                          </p>
                          <p className="text-[10px] text-[var(--text-muted)] mt-2 font-bold uppercase tracking-widest">
                            of all tool usage
                          </p>
                        </div>

                        <p className="text-sm text-center font-semibold text-[var(--text-secondary)]">
                          Used in{" "}
                          <span className="text-[var(--accent)]">
                            {(
                              topToolsDisplay.isMultiple &&
                              topToolsDisplay.tools
                            ) ?
                              topToolsDisplay.tools
                                .map((t) => t.count)
                                .join(" & ")
                            : topToolsDisplay.tool ?
                              topToolsDisplay.tool.count
                            : null}
                          </span>{" "}
                          project
                          {topToolsDisplay.isMultiple && topToolsDisplay.tools ?
                            "s"
                          : (
                            topToolsDisplay.tool &&
                            topToolsDisplay.tool.count !== 1
                          ) ?
                            "s"
                          : ""}
                        </p>
                      </div>
                    : <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                        <div className="h-12 w-12 rounded-xl bg-[var(--bg-accent-soft)] flex items-center justify-center mb-3">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke={ORANGE}
                            strokeWidth="1.75">
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                          </svg>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)]">
                          No tools used yet
                        </p>
                      </div>
                    }
                  </Card>
                </div>
              </section>

              {/* ── Row C: Category Breakdown ── */}
              <section>
                <SectionLabel>Category Breakdown</SectionLabel>
                <Card className="h-[500px] flex flex-col">
                  <div className="flex-shrink-0">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
                      <CardLabel>Tool Usage by Category</CardLabel>
                      {toolAnalytics.hasData && (
                        <span className="text-sm font-semibold text-[var(--text-secondary)] -mt-2 sm:mt-0">
                          {toolAnalytics.totalUsage} total tool
                          {toolAnalytics.totalUsage !== 1 ? "s" : ""} used
                        </span>
                      )}
                    </div>

                    {toolAnalytics.hasData && (
                      <div className="flex gap-2 flex-wrap mb-6">
                        <button
                          onClick={() => setSelectedCategory(null)}
                          className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-all border ${
                            selectedCategory === null ?
                              "bg-[var(--accent)] text-white border-[var(--accent)]"
                            : "text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                          }`}>
                          All
                        </button>
                        {toolAnalytics.categories.map((cat) => (
                          <button
                            key={cat.category}
                            onClick={() => setSelectedCategory(cat.category)}
                            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-all border ${
                              selectedCategory === cat.category ?
                                "bg-[var(--accent)] text-white border-[var(--accent)]"
                              : "text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
                            }`}>
                            {cat.category}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {toolAnalytics.hasData ?
                    <div
                      className={`flex-1 min-h-0 ${selectedCategory === null ? "md:grid md:grid-cols-2 md:gap-8" : ""}`}>
                      {/* Left: Pie chart */}
                      {selectedCategory === null && (
                        <div className="min-w-0 flex-shrink-0">
                          <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest mb-3">
                            Usage Share
                          </p>
                          <div className="flex justify-center">
                            <ResponsiveContainer width="100%" height={280}>
                              <PieChart>
                                <Pie
                                  data={toolAnalytics.categories}
                                  dataKey="totalUsage"
                                  nameKey="category"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={85}
                                  paddingAngle={3}>
                                  {toolAnalytics.categories.map((_, i) => (
                                    <Cell
                                      key={i}
                                      fill={PIE_COLORS[i % PIE_COLORS.length]}
                                      stroke={getCSSVar("--bg-card")}
                                      strokeWidth={2}
                                    />
                                  ))}
                                </Pie>
                                <Tooltip
                                  contentStyle={{
                                    borderRadius: 10,
                                    border: `1px solid ${getCSSVar("--border")}`,
                                    background: getCSSVar("--bg-card"),
                                    color: getCSSVar("--text-primary"),
                                    fontSize: 12,
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                  }}
                                  formatter={(value, name) => {
                                    const numValue =
                                      typeof value === "number" ? value : 0;
                                    return [`${numValue} uses`, name];
                                  }}
                                />
                                <Legend
                                  iconType="circle"
                                  iconSize={8}
                                  layout="horizontal"
                                  verticalAlign="bottom"
                                  align="center"
                                  wrapperStyle={{
                                    fontSize: 11,
                                    color: getCSSVar("--text-secondary"),
                                    paddingTop: 16,
                                  }}
                                  formatter={(value) => (
                                    <span
                                      style={{
                                        color: getCSSVar("--text-primary"),
                                        fontWeight: 500,
                                      }}>
                                      {value}
                                    </span>
                                  )}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}

                      {/* Right: scrollable category list */}
                      <div
                        className={`min-w-0 ${selectedCategory === null ? "overflow-y-auto scrollbar-hide" : "overflow-y-auto scrollbar-hide h-full"}`}>
                        <p className="text-[10px] text-[var(--text-muted)] font-semibold uppercase tracking-widest mb-3 sticky top-0 bg-[var(--bg-card)] py-2">
                          {selectedCategory ?? "All categories"}
                        </p>
                        <CategoryBreakdown categories={visibleCategories} />
                      </div>
                    </div>
                  : <div className="flex-1 flex flex-col items-center justify-center py-14 text-center">
                      <div className="mb-3 h-12 w-12 rounded-xl bg-[var(--bg-accent-soft)] flex items-center justify-center">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke={ORANGE}
                          strokeWidth="1.75">
                          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                        </svg>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)]">
                        No tool usage data available
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        Tools will appear here as you add them to projects
                      </p>
                    </div>
                  }
                </Card>
              </section>
            </div>
          </div>
        </main>
      </div>

      <AlertContainer toasts={toasts} onRemove={remove} position="top-center" />
    </div>
  );
}
