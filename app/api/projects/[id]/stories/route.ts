import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const stories = await prisma.story.findMany({
    where: { projectId: params.id },
    include: { _count: { select: { threads: true } } },
    orderBy: { createdAt: "asc" },
  });

  return Response.json(stories);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { storyId, title, url } = await req.json();
  if (!storyId || !title || !url) {
    return Response.json({ error: "storyId, title, and url are required" }, { status: 400 });
  }

  const story = await prisma.story.upsert({
    where: { projectId_storyId: { projectId: params.id, storyId } },
    create: { projectId: params.id, storyId, title, url },
    update: { title, url },
  });

  return Response.json(story, { status: 201 });
}
