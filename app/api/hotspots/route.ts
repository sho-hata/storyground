// 将来のホットスポット機能のスタブ
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const fromStoryId = req.nextUrl.searchParams.get("fromStoryId");
  if (!fromStoryId) {
    return Response.json({ error: "fromStoryId is required" }, { status: 400 });
  }

  const hotspots = await prisma.hotspot.findMany({
    where: { fromStoryId },
  });

  return Response.json(hotspots);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { fromStoryId, toStoryId, rect } = await req.json();
  if (!fromStoryId || !toStoryId || !rect) {
    return Response.json({ error: "fromStoryId, toStoryId, and rect are required" }, { status: 400 });
  }

  const hotspot = await prisma.hotspot.create({
    data: { fromStoryId, toStoryId, rect },
  });

  return Response.json(hotspot, { status: 201 });
}
