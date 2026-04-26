import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { ownerId: session.user.id },
    include: { _count: { select: { stories: true } } },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(projects);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { name, storybookUrl } = await req.json();
  if (!name || !storybookUrl) {
    return Response.json({ error: "name and storybookUrl are required" }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: { name, storybookUrl, ownerId: session.user.id },
  });

  return Response.json(project, { status: 201 });
}
