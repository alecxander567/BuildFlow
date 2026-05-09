"use client";

import { useState, useRef, useEffect } from "react";

export type DayTask = {
  id: string;
  text: string;
  done: boolean;
};

export type DailyPlan = Record<string, DayTask[]>;

interface Props {
  startDate: string;
  endDate: string;
  dailyPlan: DailyPlan;
  onChange: (plan: DailyPlan) => void;
}

function generateDateRange(start: string, end: string): string[] {
  if (!start || !end) return [];
  const dates: string[] = [];
  const cur = new Date(start);
  const last = new Date(end);
  if (cur > last) return [];
  // Cap at 366 days to avoid runaway loops
  while (cur <= last && dates.length <= 366) {
    dates.push(cur.toISOString().split("T")[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

function formatDateLabel(dateStr: string): { weekday: string; date: string } {
  const d = new Date(dateStr + "T00:00:00");
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  };
}

function isToday(dateStr: string): boolean {
  return dateStr === new Date().toISOString().split("T")[0];
}

function isPast(dateStr: string): boolean {
  return dateStr < new Date().toISOString().split("T")[0];
}

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

interface DayCardProps {
  dateStr: string;
  dayIndex: number;
  tasks: DayTask[];
  onTasksChange: (tasks: DayTask[]) => void;
}

function DayCard({ dateStr, dayIndex, tasks, onTasksChange }: DayCardProps) {
  const [open, setOpen] = useState(isToday(dateStr));
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const { weekday, date } = formatDateLabel(dateStr);
  const past = isPast(dateStr);
  const today = isToday(dateStr);
  const doneCount = tasks.filter((t) => t.done).length;
  const total = tasks.length;
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const addTask = () => {
    const text = inputVal.trim();
    if (!text) return;
    onTasksChange([...tasks, { id: uid(), text, done: false }]);
    setInputVal("");
    inputRef.current?.focus();
  };

  const toggleTask = (id: string) => {
    onTasksChange(
      tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    );
  };

  const deleteTask = (id: string) => {
    onTasksChange(tasks.filter((t) => t.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTask();
    }
  };

  const startEdit = (task: DayTask) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  const saveEdit = () => {
    if (!editingId) return;

    onTasksChange(
      tasks.map((t) =>
        t.id === editingId ? { ...t, text: editingText.trim() || t.text } : t,
      ),
    );

    setEditingId(null);
    setEditingText("");
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-200 overflow-hidden ${
        today ? "shadow-sm" : ""
      }`}
      style={{
        borderColor: today ? "var(--accent)" : "var(--border)",
        backgroundColor:
          today ? "var(--bg-card)"
          : past ? "var(--bg-base)"
          : "var(--bg-card)",
        boxShadow: today ? "0 1px 2px 0 rgb(0 0 0 / 0.05)" : undefined,
      }}>
      {/* Day header — always visible */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 px-4 py-3 text-left">
        {/* Day number pill */}
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
            today ? "text-white"
            : past ? ""
            : ""
          }`}
          style={{
            backgroundColor:
              today ? "var(--accent)"
              : past ? "var(--bg-hover)"
              : "var(--bg-base)",
            color:
              today ? "white"
              : past ? "var(--text-muted)"
              : "var(--text-secondary)",
          }}>
          {dayIndex + 1}
        </div>

        <div className="flex flex-1 min-w-0 items-center gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span
                className={`text-sm font-bold`}
                style={{
                  color:
                    today ? "var(--accent)"
                    : past ? "var(--text-muted)"
                    : "var(--text-primary)",
                }}>
                {date}
              </span>
              <span
                className="text-xs"
                style={{
                  color: today ? "var(--accent-hover)" : "var(--text-muted)",
                }}>
                {weekday}
              </span>
              {today && (
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                  style={{
                    backgroundColor: "var(--bg-accent-soft)",
                    color: "var(--accent)",
                  }}>
                  Today
                </span>
              )}
            </div>
            {total > 0 && (
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                {doneCount}/{total} task{total !== 1 ? "s" : ""} done
              </p>
            )}
            {total === 0 && (
              <p
                className="text-[11px]"
                style={{ color: "var(--border-dashed)" }}>
                No tasks yet
              </p>
            )}
          </div>
        </div>

        {/* Progress mini-bar (only if tasks exist) */}
        {total > 0 && (
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <div
              className="h-1.5 w-16 overflow-hidden rounded-full"
              style={{ backgroundColor: "var(--bg-hover)" }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${total ? (doneCount / total) * 100 : 0}%`,
                  backgroundColor:
                    doneCount === total ? "#16A34A" : "var(--accent)",
                }}
              />
            </div>
            <span
              className="text-[11px] font-semibold"
              style={{ color: "var(--text-muted)" }}>
              {total ? Math.round((doneCount / total) * 100) : 0}%
            </span>
          </div>
        )}

        {/* Chevron */}
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          style={{ color: "var(--text-muted)" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Expandable body */}
      {open && (
        <div
          className="border-t px-4 pb-4 pt-3"
          style={{ borderColor: "var(--border)" }}>
          {/* Task list */}
          {tasks.length > 0 && (
            <ul className="mb-3 flex flex-col gap-1.5">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors"
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--bg-base)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent";
                  }}>
                  <button
                    type="button"
                    onClick={() => toggleTask(task.id)}
                    className="flex shrink-0 items-center justify-center rounded-full border-2 transition-all"
                    style={{
                      height: "18px",
                      width: "18px",
                      borderColor:
                        task.done ? "#16A34A" : "var(--border-dashed)",
                      backgroundColor: task.done ? "#16A34A" : "transparent",
                    }}>
                    {task.done && (
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                  {editingId === task.id ?
                    <input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onBlur={saveEdit}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveEdit();
                      }}
                      autoFocus
                      className="flex-1 text-sm rounded px-2 py-1 outline-none"
                      style={{
                        backgroundColor: "var(--bg-card)",
                        borderColor: "var(--border)",
                        color: "var(--text-primary)",
                      }}
                    />
                  : <span
                      className={`flex-1 text-sm transition-all ${
                        task.done ? "line-through" : ""
                      }`}
                      style={{
                        color:
                          task.done ? "var(--text-muted)" : (
                            "var(--text-primary)"
                          ),
                      }}>
                      {task.text}
                    </span>
                  }

                  {/* Edit */}
                  <div className="flex items-center gap-1 ml-auto">
                    <button
                      type="button"
                      onClick={() => startEdit(task)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg transition-all"
                      style={{
                        backgroundColor: "var(--bg-base)",
                        color: "var(--text-secondary)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--bg-accent-soft)";
                        e.currentTarget.style.color = "var(--accent)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--bg-base)";
                        e.currentTarget.style.color = "var(--text-secondary)";
                      }}>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                      </svg>
                    </button>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg transition-all"
                      style={{
                        backgroundColor: "var(--bg-base)",
                        color: "var(--text-secondary)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#FEF2F2";
                        e.currentTarget.style.color = "#DC2626";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor =
                          "var(--bg-base)";
                        e.currentTarget.style.color = "var(--text-secondary)";
                      }}>
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
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {/* Add task input */}
          <div className="flex items-center gap-2">
            <div
              className="flex flex-1 items-center gap-2 rounded-lg border px-3 py-2 transition-colors focus-within:border-[var(--accent)]"
              style={{
                borderColor: "var(--border)",
                backgroundColor: "var(--bg-base)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.backgroundColor = "var(--bg-card)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.backgroundColor = "var(--bg-base)";
              }}>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ color: "var(--text-muted)" }}>
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a task for this day…"
                className="flex-1 bg-transparent text-sm outline-none"
                style={{
                  color: "var(--text-primary)",
                  placeholderColor: "var(--border-dashed)",
                }}
              />
            </div>
            <button
              type="button"
              onClick={addTask}
              disabled={!inputVal.trim()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--accent)",
              }}
              onMouseEnter={(e) => {
                if (inputVal.trim()) {
                  e.currentTarget.style.backgroundColor = "var(--accent-hover)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "var(--accent)";
              }}>
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DailyTasksField({
  startDate,
  endDate,
  dailyPlan,
  onChange,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const dates = generateDateRange(startDate, endDate);
  const totalTasks = Object.values(dailyPlan).flat().length;
  const doneTasks = Object.values(dailyPlan)
    .flat()
    .filter((t) => t.done).length;

  if (!startDate || !endDate) {
    return (
      <div
        className="rounded-2xl border border-dashed p-5"
        style={{
          borderColor: "var(--border-dashed)",
          backgroundColor: "var(--bg-card)",
        }}>
        <div className="flex items-center justify-between mb-1">
          <label
            className="block text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}>
            Daily Goals
          </label>
          <span
            className="rounded-md px-2 py-0.5 text-[10px] font-medium"
            style={{
              backgroundColor: "var(--bg-hover)",
              color: "var(--text-muted)",
            }}>
            Optional
          </span>
        </div>
        <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
          Set a start date and end date first to unlock daily goals.
        </p>
      </div>
    );
  }

  const handleDayChange = (dateStr: string, tasks: DayTask[]) => {
    const updated = { ...dailyPlan };
    if (tasks.length === 0) {
      delete updated[dateStr];
    } else {
      updated[dateStr] = tasks;
    }
    onChange(updated);
  };

  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--bg-card)",
      }}>
      {/* Section header */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <label
            className="block text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}>
            Daily Goals
          </label>
          <span
            className="rounded-md px-2 py-0.5 text-[10px] font-medium"
            style={{
              backgroundColor: "var(--bg-hover)",
              color: "var(--text-muted)",
            }}>
            Optional
          </span>
        </div>
        {totalTasks > 0 && (
          <span
            className="text-[11px] font-semibold"
            style={{ color: "var(--text-secondary)" }}>
            {doneTasks}/{totalTasks} done
          </span>
        )}
      </div>
      <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
        Plan what you want to accomplish each day of your project (
        {dates.length} day{dates.length !== 1 ? "s" : ""}).
      </p>

      {/* Collapsed preview or full list */}
      {!expanded ?
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-4 text-sm font-medium transition-all"
          style={{
            borderColor: "var(--border-dashed)",
            backgroundColor: "var(--bg-base)",
            color: "var(--text-secondary)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--accent)";
            e.currentTarget.style.backgroundColor = "var(--bg-accent-soft)";
            e.currentTarget.style.color = "var(--accent)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--border-dashed)";
            e.currentTarget.style.backgroundColor = "var(--bg-base)";
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
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {totalTasks > 0 ?
            `View daily goals (${totalTasks} task${totalTasks !== 1 ? "s" : ""} across ${Object.keys(dailyPlan).length} day${Object.keys(dailyPlan).length !== 1 ? "s" : ""})`
          : `Set up daily goals for ${dates.length} day${dates.length !== 1 ? "s" : ""}`
          }
        </button>
      : <div className="flex flex-col gap-2">
          {dates.map((dateStr, i) => (
            <DayCard
              key={dateStr}
              dateStr={dateStr}
              dayIndex={i}
              tasks={dailyPlan[dateStr] ?? []}
              onTasksChange={(tasks) => handleDayChange(dateStr, tasks)}
            />
          ))}
          <button
            type="button"
            onClick={() => setExpanded(false)}
            className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-semibold transition-colors"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--bg-base)",
              color: "var(--text-secondary)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-accent-soft)";
              e.currentTarget.style.color = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-base)";
              e.currentTarget.style.color = "var(--text-secondary)";
            }}>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
            Collapse
          </button>
        </div>
      }
    </div>
  );
}
