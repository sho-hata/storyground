"use client";

import { useMemo, useState } from "react";
import type { FlowStoryRef } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onPick: (story: FlowStoryRef) => void;
  stories: FlowStoryRef[];
  usedStoryIds: Set<string>;
}

export default function StoryPickerDialog({ open, onClose, onPick, stories, usedStoryIds }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stories;
    return stories.filter(
      (s) => s.title.toLowerCase().includes(q) || s.storyId.toLowerCase().includes(q),
    );
  }, [stories, query]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-800">
          <h2 className="text-lg font-bold mb-3">Story を追加</h2>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="検索..."
            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="overflow-y-auto flex-1 p-2">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-8">該当する Story がありません</p>
          ) : (
            filtered.map((story) => {
              const used = usedStoryIds.has(story.id);
              return (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => {
                    onPick(story);
                    onClose();
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{story.title}</div>
                    <div className="text-xs text-gray-500 truncate">{story.storyId}</div>
                  </div>
                  {used && (
                    <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full">
                      配置済み
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
        <div className="p-3 border-t border-gray-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-800 hover:bg-gray-700 px-4 py-1.5 rounded-lg text-sm transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
