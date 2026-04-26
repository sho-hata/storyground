"use client";

import { useState } from "react";

interface CommentFormProps {
  placeholder?: string;
  submitLabel?: string;
  submitting?: boolean;
  onSubmit: (body: string) => void;
  onCancel?: () => void;
  showCancel?: boolean;
}

export default function CommentForm({
  placeholder = "コメントを入力...",
  submitLabel = "投稿",
  submitting = false,
  onSubmit,
  onCancel,
  showCancel = false,
}: CommentFormProps) {
  const [body, setBody] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    onSubmit(body.trim());
    setBody("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            handleSubmit(e as unknown as React.FormEvent);
          }
        }}
      />
      <div className="flex gap-2 justify-end">
        {showCancel && onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
          >
            キャンセル
          </button>
        )}
        <button
          type="submit"
          disabled={submitting || !body.trim()}
          className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
        >
          {submitting ? "送信中..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
