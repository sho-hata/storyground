"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import CommentItem from "@/components/comments/CommentItem";
import CommentForm from "@/components/comments/CommentForm";
import type { ThreadData } from "@/lib/types";

interface CommentThreadProps {
  thread: ThreadData | null;
  storyId: string;
  pendingCoords: { x: number; y: number } | null;
  currentUserId: string;
  onThreadCreated: (thread: ThreadData) => void;
  onPendingCancel: () => void;
  onStatusChange: () => void;
  onCommentAdded: () => void;
  onClose: () => void;
}

export default function CommentThread({
  thread,
  storyId,
  pendingCoords,
  currentUserId,
  onThreadCreated,
  onPendingCancel,
  onStatusChange,
  onCommentAdded,
  onClose,
}: CommentThreadProps) {
  const t = useTranslations("comment");
  const [submitting, setSubmitting] = useState(false);

  async function handleCreateThread(body: string) {
    if (!pendingCoords) return;
    setSubmitting(true);

    const res = await fetch(`/api/stories/${storyId}/threads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ x: pendingCoords.x, y: pendingCoords.y, body }),
    });

    if (res.ok) {
      const newThread = await res.json();
      onThreadCreated(newThread);
    }
    setSubmitting(false);
  }

  async function handleAddComment(body: string) {
    if (!thread) return;
    setSubmitting(true);

    await fetch(`/api/threads/${thread.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });

    onCommentAdded();
    setSubmitting(false);
  }

  async function handleToggleStatus() {
    if (!thread) return;
    const newStatus = thread.status === "open" ? "resolved" : "open";

    await fetch(`/api/threads/${thread.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    onStatusChange();
  }

  return (
    <div className="flex flex-col h-full">
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 shrink-0">
        <span className="text-sm font-medium text-gray-300">
          {pendingCoords ? t("new") : t("title")}
        </span>
        <div className="flex items-center gap-2">
          {thread && (
            <button
              onClick={handleToggleStatus}
              className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                thread.status === "open"
                  ? "bg-green-900/50 text-green-300 hover:bg-green-800/50"
                  : "bg-gray-700 text-gray-400 hover:bg-gray-600"
              }`}
            >
              {thread.status === "open" ? t("resolve") : t("reopen")}
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors"
            aria-label={t("close")}
          >
            ✕
          </button>
        </div>
      </div>

      {/* コメント一覧 */}
      <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-4">
        {thread ? (
          thread.comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              isCurrentUser={comment.author.id === currentUserId}
            />
          ))
        ) : (
          <p className="text-gray-500 text-sm">{t("hint")}</p>
        )}
      </div>

      {/* 入力フォーム */}
      <div className="border-t border-gray-800 p-3 shrink-0">
        {pendingCoords ? (
          <CommentForm
            placeholder={t("placeholder")}
            submitLabel={t("submit")}
            submitting={submitting}
            onSubmit={handleCreateThread}
            onCancel={onPendingCancel}
            showCancel
          />
        ) : thread ? (
          <CommentForm
            placeholder={t("reply_placeholder")}
            submitLabel={t("reply")}
            submitting={submitting}
            onSubmit={handleAddComment}
          />
        ) : null}
      </div>
    </div>
  );
}
