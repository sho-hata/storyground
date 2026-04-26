import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await prisma.project.findFirst({
    where: { id: params.id, ownerId: session.user.id },
    select: { id: true },
  });
  if (!project) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const flows = await prisma.flow.findMany({
    where: { projectId: params.id },
    select: {
      id: true,
      name: true,
      description: true,
      updatedAt: true,
      _count: { select: { nodes: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return Response.json(flows);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const project = await prisma.project.findFirst({
    where: { id: params.id, ownerId: session.user.id },
    select: { id: true },
  });
  if (!project) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const { name, description } = await req.json();
  if (!name || typeof name !== "string") {
    return Response.json({ error: "name is required" }, { status: 400 });
  }

  try {
    const flow = await prisma.flow.create({
      data: {
        projectId: params.id,
        name,
        description: description ?? null,
      },
    });
    return Response.json(flow, { status: 201 });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
      return Response.json({ error: "name already exists in this project" }, { status: 409 });
    }
    throw e;
  }
}
