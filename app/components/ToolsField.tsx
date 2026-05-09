"use client";

import Link from "next/link";

type ToolsMap = Record<string, string[]>;

type Props = {
  catalog: ToolsMap;
  onCatalogChange: (catalog: ToolsMap) => void;
  selectedTools: ToolsMap;
  onSelectedToolsChange: (selected: ToolsMap) => void;
};

export default function ToolsField({
  catalog,
  selectedTools,
  onSelectedToolsChange,
}: Props) {
  const safeCatalog = catalog ?? {};
  const safeSelected = selectedTools ?? {};

  const hasCategories = Object.keys(safeCatalog).length > 0;
  const totalSelected = Object.values(safeSelected).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );

  const toggleTool = (category: string, tool: string) => {
    const current = safeSelected[category] ?? [];
    const updated =
      current.includes(tool) ?
        current.filter((t) => t !== tool)
      : [...current, tool];
    const next = { ...safeSelected };
    if (updated.length === 0) delete next[category];
    else next[category] = updated;
    onSelectedToolsChange(next);
  };

  const isSelected = (category: string, tool: string) =>
    (safeSelected[category] ?? []).includes(tool);

  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--bg-card)",
      }}>
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label
            className="block text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--text-muted)" }}>
            Tools & Resources
          </label>
          {totalSelected > 0 && (
            <span
              className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
              style={{
                backgroundColor: "var(--bg-accent-soft)",
                color: "var(--accent)",
              }}>
              {totalSelected} selected
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/tools"
            className="flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium transition-colors"
            style={{
              backgroundColor: "var(--bg-hover)",
              color: "var(--text-muted)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-accent-soft)";
              e.currentTarget.style.color = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-hover)";
              e.currentTarget.style.color = "var(--text-muted)";
            }}>
            <svg
              width="10"
              height="10"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
            Manage tools
          </Link>
          <span
            className="rounded-md px-2 py-0.5 text-[10px] font-medium"
            style={{
              backgroundColor: "var(--bg-hover)",
              color: "var(--text-muted)",
            }}>
            Optional
          </span>
        </div>
      </div>

      {/* Empty state */}
      {!hasCategories && (
        <div
          className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 text-center"
          style={{
            borderColor: "var(--border-dashed)",
            backgroundColor: "var(--bg-base)",
          }}>
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl border"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--bg-card)",
              color: "var(--text-muted)",
            }}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          </div>
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-secondary)" }}>
              No tools in your catalog yet
            </p>
            <p
              className="mt-0.5 text-[11px]"
              style={{ color: "var(--text-muted)" }}>
              Add tools from your Tools page — they&apos;ll appear here for
              selection
            </p>
          </div>
          <Link
            href="/tools"
            className="flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition-colors"
            style={{
              borderColor: "var(--accent)",
              backgroundColor: "var(--bg-accent-soft)",
              color: "var(--accent)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--accent)";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "var(--bg-accent-soft)";
              e.currentTarget.style.color = "var(--accent)";
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
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Go to My Tools
          </Link>
        </div>
      )}

      {/* Categories + selectable tool chips */}
      {hasCategories && (
        <div className="flex flex-col gap-5">
          {Object.entries(safeCatalog).map(([category, categoryTools]) => (
            <div key={category}>
              {/* Category row */}
              <div className="mb-2.5 flex items-center gap-1.5">
                <span
                  className="text-[11px] font-bold uppercase tracking-widest"
                  style={{ color: "var(--text-secondary)" }}>
                  {category}
                </span>
                {(safeSelected[category]?.length ?? 0) > 0 && (
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[9px] font-bold"
                    style={{
                      backgroundColor: "var(--bg-accent-soft)",
                      color: "var(--accent)",
                    }}>
                    {safeSelected[category].length}
                  </span>
                )}
              </div>

              {/* Tool chips */}
              {categoryTools.length === 0 ?
                <p
                  className="text-[11px] italic"
                  style={{ color: "var(--text-muted)" }}>
                  No tools in this category yet.{" "}
                  <Link
                    href="/tools"
                    className="transition-colors hover:underline"
                    style={{ color: "var(--accent)" }}>
                    Add some →
                  </Link>
                </p>
              : <div className="flex flex-wrap gap-2">
                  {categoryTools.map((tool) => {
                    const selected = isSelected(category, tool);
                    return (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => toggleTool(category, tool)}
                        className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-1.5 text-xs font-medium transition-all ${
                          selected ?
                            "border-[var(--accent)] bg-[var(--bg-accent-soft)] text-[var(--accent)]"
                          : "border-[var(--border)] bg-[var(--bg-base)] text-[var(--text-secondary)] hover:border-[var(--accent)] hover:bg-[var(--bg-accent-soft)] hover:text-[var(--accent)]"
                        }`}>
                        {selected && (
                          <svg
                            width="10"
                            height="10"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                        {tool}
                      </button>
                    );
                  })}
                </div>
              }

              <div
                className="mt-4 border-b"
                style={{ borderColor: "var(--divide)" }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
