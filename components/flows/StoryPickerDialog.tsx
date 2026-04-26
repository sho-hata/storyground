"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stories;
    return stories.filter(
      (s) => s.title.toLowerCase().includes(q) || s.storyId.toLowerCase().includes(q),
    );
  }, [stories, query]);

  // Reset active index when filtered list changes
  useEffect(() => {
    setActiveIndex(0);
  }, [filtered]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const item = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
    item?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && filtered[activeIndex]) {
      onPick(filtered[activeIndex]);
      onClose();
    } else if (e.key === "Escape") {
      onClose();
    }
  };

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
            onKeyDown={handleKeyDown}
            placeholder="検索..."
            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div ref={listRef} className="overflow-y-auto flex-1 p-2">
          {filtered.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-8">該当する Story がありません</p>
          ) : (
            filtered.map((story, index) => {
              const used = usedStoryIds.has(story.id);
              return (
                <button
                  key={story.id}
                  data-index={index}
                  type="button"
                  onClick={() => {
                    onPick(story);
                    onClose();
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    index === activeIndex ? "bg-gray-700" : "hover:bg-gray-800"
                  }`}
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
