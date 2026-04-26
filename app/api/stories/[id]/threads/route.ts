import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const showResolved = req.nextUrl.searchParams.get("showResolved") === "true";

  const story = await prisma.story.findFirst({
    where: { id: params.id, project: { ownerId: session.user.id } },
    select: { id: true },
  });
  if (!story) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const threads = await prisma.commentThread.findMany({
    where: {
      storyId: params.id,
      ...(showResolved ? {} : { status: "open" }),
    },
    include: {
      comments: {
        include: { author: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "asc" },
      },
      author: { select: { id: true, name: true, image: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  return Response.json(threads);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { x, y, body } = await req.json();
  if (x == null || y == null || !body) {
    return Response.json({ error: "x, y, and body are required" }, { status: 400 });
  }
  if (typeof x !== "number" || typeof y !== "number" || x < 0 || y < 0 || x > 1 || y > 1) {
    return Response.json({ error: "x and y must be numbers between 0 and 1" }, { status: 400 });
  }
  if (typeof body !== "string" || body.length > 10000) {
    return Response.json({ error: "body must be a string of at most 10000 characters" }, { status: 400 });
  }

  const storyForPost = await prisma.story.findFirst({
    where: { id: params.id, project: { ownerId: session.user.id } },
    select: { id: true },
  });
  if (!storyForPost) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const thread = await prisma.$transaction(async (tx) => {
    const t = await tx.commentThread.create({
      data: { storyId: params.id, x, y, authorId: session.user.id },
    });
    await tx.comment.create({
      data: { threadId: t.id, authorId: session.user.id, body },
    });
    return tx.commentThread.findUnique({
      where: { id: t.id },
      include: {
        comments: {
          include: { author: { select: { id: true, name: true, image: true } } },
          orderBy: { createdAt: "asc" },
        },
        author: { select: { id: true, name: true, image: true } },
      },
    });
  });

  return Response.json(thread, { status: 201 });
}
