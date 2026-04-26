"use client";

import { useRef } from "react";
import CommentPin from "@/components/viewer/CommentPin";
import type { ThreadData } from "@/lib/types";

interface PinLayerProps {
  threads: ThreadData[];
  activeThreadId: string | null;
  pendingCoords: { x: number; y: number } | null;
  onPinClick: (threadId: string) => void;
  onPinMove?: (threadId: string, x: number, y: number) => void;
}

export default function PinLayer({
  threads,
  activeThreadId,
  pendingCoords,
  onPinClick,
  onPinMove,
}: PinLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="absolute inset-0">
      {threads.map((thread, index) => (
        <CommentPin
          key={thread.id}
          x={thread.x}
          y={thread.y}
          index={index + 1}
          isActive={thread.id === activeThreadId}
          isResolved={thread.status === "resolved"}
          commentCount={thread.comments.length}
          onClick={() => onPinClick(thread.id)}
          onMove={onPinMove ? (x, y) => onPinMove(thread.id, x, y) : undefined}
          containerRef={containerRef}
        />
      ))}
      {/* 配置中の仮ピン */}
      {pendingCoords && (
        <div
          style={{
            position: "absolute",
            left: `${pendingCoords.x * 100}%`,
            top: `${pendingCoords.y * 100}%`,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
          className="w-7 h-7 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-xs font-bold text-white shadow-lg animate-pulse"
        >
          +
        </div>
      )}
    </div>
  );
}
