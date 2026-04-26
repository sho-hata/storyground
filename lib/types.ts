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
