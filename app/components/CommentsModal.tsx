"use client";

import React, { useEffect, useRef, useState } from "react";
import { useComments, type Comment } from "@/app/hooks/useComments";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatRelativeTime(isoStr: string) {
  const diff = Date.now() - new Date(isoStr).getTime();
  const s = Math.floor(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(isoStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getInitials(email: string) {
  const parts = email.split("@")[0].split(/[._-]/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

// Deterministic hue from email string
function emailHue(email: string) {
  let hash = 0;
  for (let i = 0; i < email.length; i++)
    hash = email.charCodeAt(i) + ((hash << 5) - hash);
  return Math.abs(hash) % 360;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface AvatarProps {
  email: string;
  size?: number;
}

function Avatar({ email, size = 30 }: AvatarProps) {
  const hue = emailHue(email);
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-bold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: `hsl(${hue}, 60%, 50%)`,
        color: "#fff",
        letterSpacing: "0.02em",
      }}>
      {getInitials(email)}
    </div>
  );
}

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  onEdit: (id: string, text: string) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  isDark: boolean;
}

function CommentItem({
  comment,
  currentUserId,
  onEdit,
  onDelete,
  isDark,
}: CommentItemProps) {
  const isOwn = comment.userId === currentUserId;
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLTextAreaElement>(null);

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  // Auto-focus textarea when editing starts
  useEffect(() => {
    if (editing) editRef.current?.focus();
  }, [editing]);

  const handleSave = async () => {
    if (!editText.trim() || editText.trim() === comment.text) {
      setEditing(false);
      setEditText(comment.text);
      return;
    }
    setSaving(true);
    const ok = await onEdit(comment.id, editText);
    setSaving(false);
    if (ok) setEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSave();
    if (e.key === "Escape") {
      setEditing(false);
      setEditText(comment.text);
    }
  };

  const accentBg = isDark ? "#2d1a00" : "#FEF0E7";
  const accentBorder = isDark ? "#7c3900" : "#F5C89A";

  return (
    <div className="group flex gap-3 py-3">
      <Avatar email={comment.userEmail} />

      <div className="flex flex-1 flex-col gap-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="truncate text-xs font-bold"
              style={{ color: "var(--text-primary)" }}>
              {comment.userEmail.split("@")[0]}
            </span>
            <span
              className="text-[10px]"
              style={{ color: "var(--text-muted)" }}>
              {formatRelativeTime(comment.createdAt)}
              {comment.updatedAt && " · edited"}
            </span>
          </div>

          {isOwn && !editing && (
            <div className="relative shrink-0" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex h-6 w-6 items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: "var(--text-muted)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "var(--bg-hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="19" cy="12" r="1" />
                  <circle cx="5" cy="12" r="1" />
                </svg>
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 top-7 z-10 w-32 rounded-xl border p-1 shadow-lg"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border)",
                  }}>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setEditing(true);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors"
                    style={{ color: "var(--text-primary)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = accentBg;
                      e.currentTarget.style.color = "#E8610A";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }}>
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(comment.id);
                    }}
                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-xs font-medium transition-colors"
                    style={{ color: "#DC2626" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        isDark ? "#3b1111" : "#FEF2F2")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }>
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14H6L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M9 6V4h6v2" />
                    </svg>
                    Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Body */}
        {editing ?
          <div className="flex flex-col gap-2">
            <textarea
              ref={editRef}
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={3}
              className="w-full resize-none rounded-xl border px-3 py-2 text-xs leading-relaxed outline-none transition-colors"
              style={{
                backgroundColor: "var(--bg-base)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
              onFocus={(e) =>
                (e.currentTarget.style.borderColor = accentBorder)
              }
              onBlur={(e) =>
                (e.currentTarget.style.borderColor = "var(--border)")
              }
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving || !editText.trim()}
                className="rounded-lg px-3 py-1.5 text-[11px] font-semibold text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: "#E8610A" }}
                onMouseEnter={(e) => {
                  if (!saving)
                    e.currentTarget.style.backgroundColor = "#D15508";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#E8610A";
                }}>
                {saving ? "Saving…" : "Save"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setEditText(comment.text);
                }}
                className="rounded-lg px-3 py-1.5 text-[11px] font-medium transition-colors"
                style={{
                  backgroundColor: "var(--bg-hover)",
                  color: "var(--text-secondary)",
                }}>
                Cancel
              </button>
              <span
                className="text-[10px]"
                style={{ color: "var(--text-muted)" }}>
                ⌘↵ to save
              </span>
            </div>
          </div>
        : <p
            className="text-xs leading-relaxed whitespace-pre-wrap break-words"
            style={{ color: "var(--text-secondary)" }}>
            {comment.text}
          </p>
        }
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main modal
// ---------------------------------------------------------------------------

export interface CommentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle: string;
  currentUserId?: string;
  currentUserEmail?: string;
  isDark: boolean;
}

export default function CommentsModal({
  isOpen,
  onClose,
  projectId,
  projectTitle,
  currentUserId,
  currentUserEmail,
  isDark,
}: CommentsModalProps) {
  const {
    comments,
    loading,
    submitting,
    addComment,
    editComment,
    deleteComment,
  } = useComments(projectId, currentUserId, currentUserEmail);

  const [draft, setDraft] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Keyboard close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  const handleSubmit = async () => {
    if (!draft.trim() || submitting) return;
    const ok = await addComment(draft);
    if (ok) {
      setDraft("");
      // Scroll list to top (newest first)
      setTimeout(
        () => listRef.current?.scrollTo({ top: 0, behavior: "smooth" }),
        50,
      );
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSubmit();
  };

  const accentBorder = isDark ? "#7c3900" : "#F5C89A";
  const canSubmit =
    !!currentUserId && !!currentUserEmail && draft.trim().length > 0;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative flex w-full max-w-lg flex-col rounded-2xl border shadow-2xl"
        style={{
          backgroundColor: "var(--bg-card)",
          borderColor: "var(--border)",
          maxHeight: "85vh",
        }}
        onClick={(e) => e.stopPropagation()}>
        {/* ── Header ── */}
        <div
          className="flex items-center justify-between rounded-t-2xl border-b px-5 py-4"
          style={{ borderColor: "var(--divide)" }}>
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
              style={{ backgroundColor: isDark ? "#2d1a00" : "#FEF0E7" }}>
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#E8610A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h2
                className="text-sm font-bold truncate"
                style={{
                  fontFamily: "'Sora', sans-serif",
                  color: "var(--text-primary)",
                }}>
                Comments
              </h2>
              <p
                className="truncate text-[11px]"
                style={{ color: "var(--text-muted)" }}>
                {projectTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!loading && (
              <span
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{
                  backgroundColor: isDark ? "#2d1a00" : "#FEF0E7",
                  color: "#E8610A",
                }}>
                {comments.length}
              </span>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = "var(--bg-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }>
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
        </div>

        {/* ── Comment list ── */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto px-5"
          style={{ minHeight: 0 }}>
          {loading ?
            <div className="flex items-center justify-center py-12">
              <div
                className="h-5 w-5 animate-spin rounded-full border-2 border-t-transparent"
                style={{
                  borderColor: "#E8610A",
                  borderTopColor: "transparent",
                }}
              />
            </div>
          : comments.length === 0 ?
            <div className="flex flex-col items-center gap-2 py-12">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ backgroundColor: isDark ? "#21262d" : "#F3F4F6" }}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ color: "var(--text-muted)" }}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <p
                className="text-sm font-semibold"
                style={{ color: "var(--text-secondary)" }}>
                No comments yet
              </p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Be the first to leave one
              </p>
            </div>
          : <div className="divide-y" style={{ borderColor: "var(--divide)" }}>
              {comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  currentUserId={currentUserId}
                  onEdit={editComment}
                  onDelete={deleteComment}
                  isDark={isDark}
                />
              ))}
            </div>
          }
        </div>

        {/* ── Compose area ── */}
        <div
          className="border-t px-5 py-4"
          style={{ borderColor: "var(--divide)" }}>
          {currentUserId && currentUserEmail ?
            <div className="flex gap-3">
              <Avatar email={currentUserEmail} />
              <div className="flex flex-1 flex-col gap-2">
                <textarea
                  ref={textareaRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Write a comment…"
                  rows={2}
                  className="w-full resize-none rounded-xl border px-3 py-2.5 text-xs leading-relaxed outline-none transition-colors"
                  style={{
                    backgroundColor: "var(--bg-base)",
                    borderColor: "var(--border)",
                    color: "var(--text-primary)",
                  }}
                  onFocus={(e) =>
                    (e.currentTarget.style.borderColor = accentBorder)
                  }
                  onBlur={(e) =>
                    (e.currentTarget.style.borderColor = "var(--border)")
                  }
                />
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px]"
                    style={{ color: "var(--text-muted)" }}>
                    ⌘↵ to post
                  </span>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canSubmit || submitting}
                    className="flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-semibold text-white transition-all active:scale-95 disabled:opacity-40"
                    style={{ backgroundColor: "#E8610A" }}
                    onMouseEnter={(e) => {
                      if (canSubmit && !submitting)
                        e.currentTarget.style.backgroundColor = "#D15508";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#E8610A";
                    }}>
                    {submitting ?
                      <span
                        className="h-3 w-3 animate-spin rounded-full border-2 border-t-transparent"
                        style={{
                          borderColor: "#fff",
                          borderTopColor: "transparent",
                        }}
                      />
                    : <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                      </svg>
                    }
                    Post
                  </button>
                </div>
              </div>
            </div>
          : <p
              className="py-2 text-center text-xs"
              style={{ color: "var(--text-muted)" }}>
              Sign in to leave a comment
            </p>
          }
        </div>
      </div>
    </div>
  );
}
