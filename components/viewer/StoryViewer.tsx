"use client";

import { useEffect, useRef } from "react";
import PinLayer from "@/components/viewer/PinLayer";
import type { ThreadData } from "@/lib/types";

interface StoryViewerProps {
  storyUrl: string;
  threads: ThreadData[];
  isPlacing: boolean;
  activeThreadId: string | null;
  pendingCoords: { x: number; y: number } | null;
  onPinPlace: (x: number, y: number) => void;
  onPinClick: (threadId: string) => void;
  onPinMove?: (threadId: string, x: number, y: number) => void;
  onEscape: () => void;
}

export default function StoryViewer({
  storyUrl,
  threads,
  isPlacing,
  activeThreadId,
  pendingCoords,
  onPinPlace,
  onPinClick,
  onPinMove,
  onEscape,
}: StoryViewerProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onEscape();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onEscape]);

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!isPlacing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    onPinPlace(x, y);
  }

  return (
    <div className="w-full h-full relative">
      <iframe src={storyUrl} className="w-full h-full border-0" title="Storybook Story" />
      {/* オーバーレイ: isPlacing 時のみクリックを受け取る */}
      <div
        ref={overlayRef}
        onClick={handleOverlayClick}
        className="absolute inset-0"
        style={{
          pointerEvents: isPlacing ? "auto" : "none",
          cursor: isPlacing ? "crosshair" : "default",
          zIndex: 10,
          backgroundColor: isPlacing ? "rgba(59, 130, 246, 0.05)" : "transparent",
        }}
      />
      {/* ピンレイヤー: 常に表示, ピン自体はクリック可能にする */}
      <div className="absolute inset-0" style={{ pointerEvents: "none", zIndex: 11 }}>
        <PinLayer
          threads={threads}
          activeThreadId={activeThreadId}
          pendingCoords={pendingCoords}
          onPinClick={onPinClick}
          onPinMove={onPinMove}
        />
      </div>
    </div>
  );
}
