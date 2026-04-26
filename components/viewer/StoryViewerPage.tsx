"use client";

import { useState, useCallback } from "react";
import { useThreads } from "@/hooks/useThreads";
import StoryViewer from "@/components/viewer/StoryViewer";
import CommentThread from "@/components/comments/CommentThread";
import type { ThreadData } from "@/lib/types";

interface StoryViewerPageProps {
  storyId: string;
  storyUrl: string;
  currentUserId: string;
}

export default function StoryViewerPage({ storyId, storyUrl, currentUserId }: StoryViewerPageProps) {
  const [isPlacing, setIsPlacing] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [showResolved, setShowResolved] = useState(false);
  const [pendingCoords, setPendingCoords] = useState<{ x: number; y: number } | null>(null);

  const { threads, setThreads, mutate } = useThreads(storyId, showResolved);

  const activeThread = threads?.find((t) => t.id === activeThreadId) ?? null;

  const handlePinPlace = useCallback((x: number, y: number) => {
    setIsPlacing(false);
    setPendingCoords({ x, y });
    setActiveThreadId(null);
  }, []);

  const handleThreadCreated = useCallback(
    (thread: ThreadData) => {
      setPendingCoords(null);
      setActiveThreadId(thread.id);
      mutate();
    },
    [mutate]
  );

  const handlePendingCancel = useCallback(() => {
    setPendingCoords(null);
  }, []);

  const handleStatusChange = useCallback(() => {
    mutate();
    setActiveThreadId(null);
  }, [mutate]);

  const handleCommentAdded = useCallback(() => {
    mutate();
  }, [mutate]);

  const handlePinMove = useCallback(
    async (threadId: string, x: number, y: number) => {
      setThreads((prev) => prev ? prev.map((t) => t.id === threadId ? { ...t, x, y } : t) : prev);
      await fetch(`/api/threads/${threadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x, y }),
      });
    },
    [setThreads]
  );

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* ビューアエリア */}
      <div className="flex-1 relative bg-gray-950">
        {/* ツールバー */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          <button
            onClick={() => {
              setIsPlacing((v) => !v);
              setPendingCoords(null);
              setActiveThreadId(null);
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              isPlacing
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {isPlacing ? "クリックして配置..." : "+ コメントを追加"}
          </button>
          <button
            onClick={() => setShowResolved((v) => !v)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              showResolved
                ? "bg-gray-600 text-white"
                : "bg-gray-800 text-gray-500 hover:bg-gray-700"
            }`}
          >
            {showResolved ? "解決済みを非表示" : "解決済みを表示"}
          </button>
        </div>

        <StoryViewer
          storyUrl={storyUrl}
          threads={threads ?? []}
          isPlacing={isPlacing}
          activeThreadId={activeThreadId}
          pendingCoords={pendingCoords}
          onPinPlace={handlePinPlace}
          onPinClick={(id) => {
            setActiveThreadId(id);
            setPendingCoords(null);
            setIsPlacing(false);
          }}
          onPinMove={handlePinMove}
          onEscape={() => {
            setIsPlacing(false);
            setPendingCoords(null);
          }}
        />
      </div>

      {/* スレッドパネル */}
      {(activeThread || pendingCoords) && (
        <div className="w-80 border-l border-gray-800 bg-gray-900 flex flex-col shrink-0">
          <CommentThread
            thread={activeThread ?? null}
            storyId={storyId}
            pendingCoords={pendingCoords}
            currentUserId={currentUserId}
            onThreadCreated={handleThreadCreated}
            onPendingCancel={handlePendingCancel}
            onStatusChange={handleStatusChange}
            onCommentAdded={handleCommentAdded}
            onClose={() => {
              setActiveThreadId(null);
              setPendingCoords(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
