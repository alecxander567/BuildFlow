"use client";

import { useCallback, useEffect, useState } from "react";

export interface Comment {
  id: string;
  projectId: string;
  userId: string;
  userEmail: string;
  text: string;
  createdAt: string; // ISO string
  updatedAt?: string;
}

// ---------------------------------------------------------------------------
// Persistence helpers — swap these out for your real DB calls
// ---------------------------------------------------------------------------

function storageKey(projectId: string) {
  return `comments:${projectId}`;
}

function loadComments(projectId: string): Comment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(projectId));
    return raw ? (JSON.parse(raw) as Comment[]) : [];
  } catch {
    return [];
  }
}

function saveComments(projectId: string, comments: Comment[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(storageKey(projectId), JSON.stringify(comments));
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useComments(
  projectId: string,
  currentUserId?: string,
  currentUserEmail?: string,
) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Load on mount / projectId change
  useEffect(() => {
    setLoading(true);
    const fetched = loadComments(projectId);
    setComments(fetched);
    setLoading(false);
  }, [projectId]);

  const addComment = useCallback(
    async (text: string): Promise<boolean> => {
      if (!text.trim() || !currentUserId || !currentUserEmail) return false;
      setSubmitting(true);
      try {
        const newComment: Comment = {
          id: crypto.randomUUID(),
          projectId,
          userId: currentUserId,
          userEmail: currentUserEmail,
          text: text.trim(),
          createdAt: new Date().toISOString(),
        };
        setComments((prev) => {
          const next = [newComment, ...prev];
          saveComments(projectId, next);
          return next;
        });
        return true;
      } finally {
        setSubmitting(false);
      }
    },
    [projectId, currentUserId, currentUserEmail],
  );

  const editComment = useCallback(
    async (commentId: string, newText: string): Promise<boolean> => {
      if (!newText.trim()) return false;
      setComments((prev) => {
        const next = prev.map((c) =>
          c.id === commentId ?
            { ...c, text: newText.trim(), updatedAt: new Date().toISOString() }
          : c,
        );
        saveComments(projectId, next);
        return next;
      });
      return true;
    },
    [projectId],
  );

  const deleteComment = useCallback(
    async (commentId: string): Promise<boolean> => {
      setComments((prev) => {
        const next = prev.filter((c) => c.id !== commentId);
        saveComments(projectId, next);
        return next;
      });
      return true;
    },
    [projectId],
  );

  return {
    comments,
    commentCount: comments.length, 
    loading,
    submitting,
    addComment,
    editComment,
    deleteComment,
  };
}
