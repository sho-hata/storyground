import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

export type ThreadStatus = "open" | "resolved";

export interface CommentAuthor {
  id: string;
  name: string | null;
  image: string | null;
}

export interface CommentData {
  id: string;
  body: string;
  createdAt: string;
  author: CommentAuthor;
}

export interface ThreadData {
  id: string;
  x: number;
  y: number;
  status: ThreadStatus;
  createdAt: string;
  author: CommentAuthor;
  comments: CommentData[];
}

export interface HotspotRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface HotspotData {
  id: string;
  fromStoryId: string;
  toStoryId: string;
  rect: HotspotRect;
}

export interface FlowStoryRef {
  id: string;
  storyId: string;
  title: string;
  url: string;
}

export interface FlowNodeData {
  id: string;
  storyId: string;
  story: FlowStoryRef;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FlowEdgeData {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  sourceHandle: string | null;
  targetHandle: string | null;
  label: string | null;
}

export interface FlowData {
  id: string;
  projectId: string;
  name: string;
  description: string | null;
  nodes: FlowNodeData[];
  edges: FlowEdgeData[];
  createdAt: string;
  updatedAt: string;
}

export interface FlowSummary {
  id: string;
  name: string;
  description: string | null;
  updatedAt: string;
  _count: { nodes: number };
}

export interface FlowNodeInput {
  id: string;
  storyId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FlowEdgeInput {
  id: string;
  fromNodeId: string;
  toNodeId: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
  label?: string | null;
}
