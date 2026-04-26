"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Handle, Position, type NodeProps } from "reactflow";
import type { FlowStoryRef } from "@/lib/types";

export interface StoryNodeData {
  story: FlowStoryRef;
  projectId: string;
}

const HOVER_DELAY_MS = 250;
const VIRTUAL_W = 1280;
const VIRTUAL_H = 800;
const PREVIEW_W = 480;
const PREVIEW_H = Math.round(VIRTUAL_H * (PREVIEW_W / VIRTUAL_W));
const SCALE = PREVIEW_W / VIRTUAL_W;
const MARGIN = 8;

export default function StoryNode({ data, selected }: NodeProps<StoryNodeData>) {
  const [showPreview, setShowPreview] = useState(false);
  const [previewPos, setPreviewPos] = useState({ x: 0, y: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);
  const enterTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (enterTimer.current) clearTimeout(enterTimer.current);
      if (leaveTimer.current) clearTimeout(leaveTimer.current);
    };
  }, []);

  const onEnter = () => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    enterTimer.current = setTimeout(() => {
      if (nodeRef.current) {
        const rect = nodeRef.current.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Prefer right side; fallback to left if overflows
        let x = rect.right + MARGIN;
        if (x + PREVIEW_W > vw - MARGIN) {
          x = rect.left - PREVIEW_W - MARGIN;
        }

        // Align to top of node; adjust up if overflows bottom
        let y = rect.top;
        if (y + PREVIEW_H > vh - MARGIN) {
          y = vh - PREVIEW_H - MARGIN;
        }
        if (y < MARGIN) y = MARGIN;

        setPreviewPos({ x, y });
      }
      setShowPreview(true);
    }, HOVER_DELAY_MS);
  };

  const onLeave = () => {
    if (enterTimer.current) clearTimeout(enterTimer.current);
    leaveTimer.current = setTimeout(() => setShowPreview(false), 150);
  };

  return (
    <div
      ref={nodeRef}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      className={`relative bg-gray-900 border rounded-lg shadow-md w-60 ${
        selected ? "border-blue-500" : "border-gray-700"
      }`}
      onDoubleClick={() => {
        window.open(`/projects/${data.projectId}/stories/${data.story.id}`, "_blank");
      }}
    >
      <Handle type="source" id="top" position={Position.Top} className="!bg-gray-400 !w-2.5 !h-2.5" />
      <Handle type="source" id="right" position={Position.Right} className="!bg-gray-400 !w-2.5 !h-2.5" />
      <Handle type="source" id="bottom" position={Position.Bottom} className="!bg-gray-400 !w-2.5 !h-2.5" />
      <Handle type="source" id="left" position={Position.Left} className="!bg-gray-400 !w-2.5 !h-2.5" />

      <div className="px-4 py-3">
        <div className="font-medium text-sm text-white truncate">{data.story.title}</div>
        <div className="text-xs text-gray-500 truncate mt-0.5">{data.story.storyId}</div>
      </div>

      {showPreview &&
        createPortal(
          <div
            className="fixed z-[9999] bg-white rounded-lg shadow-2xl border border-gray-700 overflow-hidden"
            style={{
              left: previewPos.x,
              top: previewPos.y,
              width: PREVIEW_W,
              height: PREVIEW_H,
            }}
            onMouseEnter={() => {
              if (leaveTimer.current) clearTimeout(leaveTimer.current);
            }}
            onMouseLeave={() => {
              leaveTimer.current = setTimeout(() => setShowPreview(false), 150);
            }}
          >
            <iframe
              src={data.story.url}
              className="border-0"
              title={data.story.title}
              loading="lazy"
              style={{
                width: VIRTUAL_W,
                height: VIRTUAL_H,
                transform: `scale(${SCALE})`,
                transformOrigin: "top left",
              }}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}
