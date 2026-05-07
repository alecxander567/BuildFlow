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

const ORANGE = "#E8610A";
const ORANGE_LIGHT = "#F07D2E";
const ORANGE_MUTED = "#FEF0E7";
const TEXT_PRIMARY = "#1A1916";
const TEXT_SECONDARY = "#72706A";
const TEXT_DISABLED = "#B0ADA7";
const BORDER = "#EDE8E2";
const BG_FILL = "#F2EDE7";

const PIE_COLORS = ["#E8610A", "#F07D2E", "#F5A05C", "#F9C496", "#FDE2C8"];

function ProgressBar({
  value,
  thin = false,
}: {
  value: number;
  thin?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-full bg-[#F2EDE7] ${thin ? "h-1.5" : "h-2.5"}`}>
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

  if (data.length === 0)
    return (
      <p className="text-center text-sm text-[#B0ADA7] py-6">No project data</p>
    );

  const STATUS_COLORS = [ORANGE, ORANGE_LIGHT, BG_FILL];
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
            border: `1px solid ${BORDER}`,
            fontSize: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11, color: TEXT_SECONDARY }}
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
  if (tools.length === 0)
    return (
      <p className="text-center text-sm text-[#B0ADA7] py-6">
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
          stroke={BORDER}
        />
        <XAxis
          type="number"
          tick={{ fontSize: 11, fill: TEXT_SECONDARY }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fontSize: 11, fill: TEXT_PRIMARY }}
          tickLine={false}
          axisLine={false}
          width={80}
        />
        <Tooltip
          cursor={{ fill: ORANGE_MUTED }}
          contentStyle={{
            borderRadius: 10,
            border: `1px solid ${BORDER}`,
            fontSize: 12,
          }}
        />
        <Bar dataKey="count" fill={ORANGE} radius={[0, 6, 6, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function CategoryBreakdown({ categories }: { categories: CategoryStats[] }) {
  if (categories.length === 0)
    return <p className="text-center text-sm text-[#B0ADA7] py-6">No data</p>;

  return (
    <div className="space-y-5">
      {categories.map((cat) => (
        <div key={cat.category}>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="font-semibold text-[#1A1916]">{cat.category}</span>
            <span className="text-[#72706A]">
              {cat.totalUsage} uses · {cat.percentage.toFixed(1)}%
            </span>
          </div>
          <ProgressBar value={cat.percentage} />
          <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1">
            {cat.tools.slice(0, 4).map((tool) => (
              <div
                key={tool.name}
                className="flex items-center justify-between text-xs text-[#72706A]">
                <span className="truncate">{tool.name}</span>
                <span className="ml-2 font-semibold text-[#E8610A] flex-shrink-0">
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
            background={{ fill: BG_FILL }}
          />
        </RadialBarChart>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <p className="text-2xl font-black text-[#E8610A] leading-none">
            {unlocked}
          </p>
          <p className="text-xs text-[#72706A]">of {total}</p>
        </div>
      </div>
      <p className="text-sm font-bold text-[#1A1916]">{points} pts</p>
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
          "bg-[#FEF0E7] border border-[#F5C6A0]"
        : "bg-[#F9F7F4] border border-[#EDE8E2]"
      }`}>
      <span className="text-[10px] text-[#72706A] font-medium truncate">
        {label}
      </span>
      <span
        className={`text-lg font-black leading-none ${accent ? "text-[#E8610A]" : "text-[#1A1916]"}`}>
        {value}
      </span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="w-1.5 h-5 rounded-full bg-[#E8610A] inline-block flex-shrink-0" />
      <h2
        style={{ fontFamily: "'Sora', sans-serif" }}
        className="text-[11px] font-bold text-[#1A1916] uppercase tracking-widest">
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
      className={`rounded-2xl border border-[#EDE8E2] bg-white p-5 ${className}`}>
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
    <p className="text-[10px] font-semibold text-[#B0ADA7] uppercase tracking-widest mb-4">
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
        className="flex h-screen overflow-hidden bg-[#F9F7F4]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden pt-[53px] md:pt-0">
          <TopBar />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-[#E8610A] border-t-transparent" />
              <p className="mt-2 text-sm text-[#72706A]">Loading analytics…</p>
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

  // Handle multiple top tools with same percentage
  // Update the getTopToolsDisplay function with proper typing
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
    const topToolsWithSamePercentage = toolAnalytics.topTools.filter(
      (tool) => tool.percentage === topPercentage,
    );

    if (topToolsWithSamePercentage.length > 1) {
      return {
        isMultiple: true,
        tools: topToolsWithSamePercentage,
        percentage: topPercentage,
      };
    }

    return {
      isMultiple: false,
      tool: toolAnalytics.topTools[0],
      percentage: topPercentage,
    };
  };

  const topToolsDisplay = getTopToolsDisplay();

  return (
    <div
      className="flex h-screen overflow-hidden bg-[#F9F7F4]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden pt-[53px] md:pt-0">
        <TopBar />

        <main className="flex-1 overflow-y-auto">
          {/* ── Page header ── */}
          <div className="sticky top-0 z-10 border-b border-[#EDE8E2] bg-[#F9F7F4]/90 backdrop-blur-sm px-4 sm:px-6 md:px-10 py-3">
            <div className="mx-auto max-w-6xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-1 h-4 rounded-full bg-[#E8610A] inline-block" />
                <h1
                  style={{ fontFamily: "'Sora', sans-serif" }}
                  className="text-[11px] font-bold text-[#1A1916] uppercase tracking-widest">
                  Analytics
                </h1>
              </div>
              <div className="flex items-center gap-1 rounded-lg border border-[#EDE8E2] bg-white p-0.5">
                {(["all", "month", "week"] as TimeRange[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    className={`rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                      timeRange === r ?
                        "bg-[#E8610A] text-white"
                      : "text-[#72706A] hover:text-[#1A1916]"
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
              {/* ── Row A: Project Overview — 4 clean boxes without card styling ── */}
              <section>
                <SectionLabel>Project Overview</SectionLabel>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Productivity score - Box 1 */}
                  <OverviewBox className="flex flex-col items-center justify-center gap-4 bg-white rounded-2xl border border-[#EDE8E2]">
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
                              background={{ fill: BG_FILL }}
                            />
                          </RadialBarChart>
                          <div className="absolute text-center pointer-events-none">
                            <p className="text-3xl font-black text-[#E8610A] leading-none">
                              {score}
                            </p>
                            <p className="text-xs text-[#B0ADA7] mt-1">/ 100</p>
                          </div>
                        </div>
                      );
                    })()}
                    <div className="text-center">
                      <p className="text-xs font-medium text-[#72706A]">
                        Based on {productivityMetrics.totalProjects} project
                        {productivityMetrics.totalProjects !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </OverviewBox>

                  {/* Completion rates - Box 2 (Improved UX) */}
                  <OverviewBox className="flex flex-col bg-white rounded-2xl border border-[#EDE8E2]">
                    <CardLabel>Completion Rates</CardLabel>
                    <div className="flex-1 flex flex-col justify-center gap-5">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-[#1A1916]">
                            Project Completion
                          </span>
                          <span className="text-sm font-black text-[#E8610A]">
                            {productivityMetrics.projectCompletionRate}%
                          </span>
                        </div>
                        <ProgressBar
                          value={productivityMetrics.projectCompletionRate}
                        />
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <div className="text-center">
                            <p className="text-[10px] text-[#72706A]">
                              Completed
                            </p>
                            <p className="text-base font-black text-[#1A1916]">
                              {productivityMetrics.completedProjects}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-[#72706A]">Total</p>
                            <p className="text-base font-black text-[#1A1916]">
                              {productivityMetrics.totalProjects}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-[#1A1916]">
                            Task Completion
                          </span>
                          <span className="text-sm font-black text-[#E8610A]">
                            {productivityMetrics.taskCompletionRate}%
                          </span>
                        </div>
                        <ProgressBar
                          value={productivityMetrics.taskCompletionRate}
                        />
                        <div className="grid grid-cols-2 gap-2 mt-3">
                          <div className="text-center">
                            <p className="text-[10px] text-[#72706A]">
                              Completed
                            </p>
                            <p className="text-base font-black text-[#1A1916]">
                              {productivityMetrics.completedTasks}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-[#72706A]">Total</p>
                            <p className="text-base font-black text-[#1A1916]">
                              {productivityMetrics.totalTasks}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </OverviewBox>

                  {/* Status distribution - Box 3 (Centered content) */}
                  <OverviewBox className="flex flex-col bg-white rounded-2xl border border-[#EDE8E2]">
                    <CardLabel>Status Distribution</CardLabel>
                    <div className="flex-1 flex items-center justify-center">
                      <ProjectStatusChart
                        completed={productivityMetrics.completedProjects}
                        inProgress={productivityMetrics.inProgressProjects}
                        notStarted={productivityMetrics.notStartedProjects}
                      />
                    </div>
                  </OverviewBox>

                  {/* Achievements - Box 4 */}
                  <OverviewBox className="flex flex-col items-center justify-center gap-4 bg-white rounded-2xl border border-[#EDE8E2]">
                    <p className="text-[10px] font-semibold text-[#B0ADA7] uppercase tracking-widest self-start">
                      Achievements
                    </p>
                    <AchievementArc
                      unlocked={unlockedCount}
                      total={totalAchievements}
                      points={totalPoints}
                    />
                    <div className="w-full pt-3 border-t border-[#F2EDE7]">
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-[#72706A]">Completion</span>
                        <span className="font-bold text-[#1A1916]">
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

              {/* ── Row B: Tool Usage — 50/50 split ── */}
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
                                <p className="text-base font-black text-[#1A1916] leading-tight">
                                  {topToolsDisplay.tools
                                    .map((t) => t.name)
                                    .join(" & ")}
                                </p>
                                <p className="text-xs text-[#72706A] mt-0.5">
                                  Multiple favorites
                                </p>
                              </>
                            : topToolsDisplay.tool ?
                              <>
                                <p className="text-base font-black text-[#1A1916] leading-tight">
                                  {topToolsDisplay.tool.name}
                                </p>
                                <p className="text-xs text-[#72706A] mt-0.5">
                                  {topToolsDisplay.tool.category}
                                </p>
                              </>
                            : null}
                          </div>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center bg-[#FEF0E7] rounded-xl py-6 mb-4">
                          <p className="text-5xl font-black text-[#E8610A] leading-none">
                            {topToolsDisplay.percentage.toFixed(0)}
                            <span className="text-2xl">%</span>
                          </p>
                          <p className="text-[10px] text-[#B0ADA7] mt-2 font-bold uppercase tracking-widest">
                            of all tool usage
                          </p>
                        </div>

                        <p className="text-sm text-center font-semibold text-[#72706A]">
                          Used in{" "}
                          <span className="text-[#E8610A]">
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
                        <div className="h-12 w-12 rounded-xl bg-[#FEF0E7] flex items-center justify-center mb-3">
                          <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#E8610A"
                            strokeWidth="1.75">
                            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                          </svg>
                        </div>
                        <p className="text-sm text-[#72706A]">
                          No tools used yet
                        </p>
                      </div>
                    }
                  </Card>
                </div>
              </section>

              {/* ── Row C: Category Breakdown (Fixed height, only right side scrollable) ── */}
              <section>
                <SectionLabel>Category Breakdown</SectionLabel>
                <Card className="h-[500px] flex flex-col">
                  <div className="flex-shrink-0">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5">
                      <CardLabel>Tool Usage by Category</CardLabel>
                      {toolAnalytics.hasData && (
                        <span className="text-sm font-semibold text-[#72706A] -mt-2 sm:mt-0">
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
                              "bg-[#E8610A] text-white border-[#E8610A]"
                            : "text-[#72706A] border-[#EDE8E2] hover:border-[#E8610A] hover:text-[#E8610A]"
                          }`}>
                          All
                        </button>
                        {toolAnalytics.categories.map((cat) => (
                          <button
                            key={cat.category}
                            onClick={() => setSelectedCategory(cat.category)}
                            className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-all border ${
                              selectedCategory === cat.category ?
                                "bg-[#E8610A] text-white border-[#E8610A]"
                              : "text-[#72706A] border-[#EDE8E2] hover:border-[#E8610A] hover:text-[#E8610A]"
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
                      {/* Left side - Pie chart (fixed, not scrollable) */}
                      {selectedCategory === null && (
                        <div className="min-w-0 flex-shrink-0">
                          <p className="text-[10px] text-[#B0ADA7] font-semibold uppercase tracking-widest mb-3">
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
                                      stroke="white"
                                      strokeWidth={2}
                                    />
                                  ))}
                                </Pie>
                                <Tooltip
                                  contentStyle={{
                                    borderRadius: 10,
                                    border: `1px solid ${BORDER}`,
                                    fontSize: 12,
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                  }}
                                  formatter={(value, name, item) => {
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
                                    color: TEXT_SECONDARY,
                                    paddingTop: 16,
                                  }}
                                  formatter={(value) => (
                                    <span className="text-[#1A1916] font-medium">
                                      {value}
                                    </span>
                                  )}
                                />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )}

                      {/* Right side - Categories list (scrollable) */}
                      <div
                        className={`min-w-0 ${selectedCategory === null ? "overflow-y-auto scrollbar-hide" : "overflow-y-auto scrollbar-hide h-full"}`}>
                        <p className="text-[10px] text-[#B0ADA7] font-semibold uppercase tracking-widest mb-3 sticky top-0 bg-white py-2">
                          {selectedCategory ?? "All categories"}
                        </p>
                        <CategoryBreakdown categories={visibleCategories} />
                      </div>
                    </div>
                  : <div className="flex-1 flex flex-col items-center justify-center py-14 text-center">
                      <div className="mb-3 h-12 w-12 rounded-xl bg-[#FEF0E7] flex items-center justify-center">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#E8610A"
                          strokeWidth="1.75">
                          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                        </svg>
                      </div>
                      <p className="text-sm text-[#72706A]">
                        No tool usage data available
                      </p>
                      <p className="text-xs text-[#B0ADA7] mt-1">
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
