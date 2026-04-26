import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { body } = await req.json();
  if (!body) {
    return Response.json({ error: "body is required" }, { status: 400 });
  }
  if (typeof body !== "string" || body.length > 10000) {
    return Response.json({ error: "body must be a string of at most 10000 characters" }, { status: 400 });
  }

  const thread = await prisma.commentThread.findFirst({
    where: { id: params.id, story: { project: { ownerId: session.user.id } } },
    select: { id: true },
  });
  if (!thread) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const comment = await prisma.comment.create({
    data: { threadId: params.id, authorId: session.user.id, body },
    include: { author: { select: { id: true, name: true, image: true } } },
  });

  return Response.json(comment, { status: 201 });
}
