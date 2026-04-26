"use client";

import { useEffect, useRef, useState } from "react";
import { Handle, Position, type NodeProps } from "reactflow";
import type { FlowStoryRef } from "@/lib/types";

export interface StoryNodeData {
  story: FlowStoryRef;
  projectId: string;
}

const HOVER_DELAY_MS = 250;
const PREVIEW_W = 480;
const PREVIEW_H = 320;

export default function StoryNode({ data, selected }: NodeProps<StoryNodeData>) {
  const [showPreview, setShowPreview] = useState(false);
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
    enterTimer.current = setTimeout(() => setShowPreview(true), HOVER_DELAY_MS);
  };
  const onLeave = () => {
    if (enterTimer.current) clearTimeout(enterTimer.current);
    leaveTimer.current = setTimeout(() => setShowPreview(false), 150);
  };

  return (
    <div
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

      {showPreview && (
        <div
          className="absolute left-full top-0 ml-3 z-50 bg-white rounded-lg shadow-2xl border border-gray-700 overflow-hidden nodrag nopan"
          style={{ width: PREVIEW_W, height: PREVIEW_H, pointerEvents: "none" }}
        >
          <iframe
            src={data.story.url}
            className="w-full h-full border-0"
            title={data.story.title}
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}
