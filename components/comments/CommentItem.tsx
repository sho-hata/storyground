"use client";

import type { CommentData } from "@/lib/types";

interface CommentItemProps {
  comment: CommentData;
  isCurrentUser: boolean;
}

export default function CommentItem({ comment }: CommentItemProps) {
  const date = new Date(comment.createdAt);
  const formatted = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;

  return (
    <div className="flex gap-2.5">
      {comment.author.image ? (
        <img
          src={comment.author.image}
          alt={comment.author.name ?? ""}
          className="w-7 h-7 rounded-full shrink-0 mt-0.5"
        />
      ) : (
        <div className="w-7 h-7 rounded-full bg-gray-700 shrink-0 mt-0.5 flex items-center justify-center text-xs text-gray-400">
          {comment.author.name?.[0] ?? "?"}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm font-medium text-gray-200">
            {comment.author.name ?? "Anonymous"}
          </span>
          <span className="text-xs text-gray-500">{formatted}</span>
        </div>
        <p className="text-sm text-gray-300 whitespace-pre-wrap break-words">{comment.body}</p>
      </div>
    </div>
  );
}
