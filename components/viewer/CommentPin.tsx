"use client";

import { useRef, useState } from "react";

interface CommentPinProps {
  x: number;
  y: number;
  index: number;
  isActive: boolean;
  isResolved: boolean;
  commentCount: number;
  onClick: () => void;
  onMove?: (x: number, y: number) => void;
  containerRef?: React.RefObject<HTMLDivElement>;
}

export default function CommentPin({
  x,
  y,
  index,
  isActive,
  isResolved,
  onClick,
  onMove,
  containerRef,
}: CommentPinProps) {
  const dragState = useRef<{ startX: number; startY: number; moved: boolean } | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);

  const displayX = dragPos?.x ?? x;
  const displayY = dragPos?.y ?? y;

  function calcRelativePos(clientX: number, clientY: number) {
    const el = containerRef?.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)),
    };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragState.current = { startX: e.clientX, startY: e.clientY, moved: false };
  }

  function handlePointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (!dragState.current || !onMove) return;
    const dx = e.clientX - dragState.current.startX;
    const dy = e.clientY - dragState.current.startY;
    if (!dragState.current.moved && Math.sqrt(dx * dx + dy * dy) < 4) return;
    dragState.current.moved = true;
    const pos = calcRelativePos(e.clientX, e.clientY);
    if (pos) setDragPos(pos);
  }

  function handlePointerUp(e: React.PointerEvent<HTMLButtonElement>) {
    if (!dragState.current) return;
    if (dragState.current.moved && onMove) {
      const pos = calcRelativePos(e.clientX, e.clientY);
      if (pos) onMove(pos.x, pos.y);
      setDragPos(null);
    } else {
      onClick();
    }
    dragState.current = null;
  }

  return (
    <button
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: "absolute",
        left: `${displayX * 100}%`,
        top: `${displayY * 100}%`,
        transform: "translate(-50%, -50%)",
        pointerEvents: "auto",
        opacity: dragPos ? 0.7 : 1,
        cursor: onMove ? (dragPos ? "grabbing" : "grab") : "pointer",
        transition: dragPos ? "none" : undefined,
      }}
      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shadow-lg transition-all hover:scale-110 ${
        isActive
          ? "bg-blue-500 border-white text-white scale-110 ring-2 ring-blue-400"
          : isResolved
          ? "bg-gray-600 border-gray-400 text-gray-300"
          : "bg-blue-600 border-white text-white hover:bg-blue-500"
      }`}
      title={`コメント #${index}`}
    >
      {index}
    </button>
  );
}
