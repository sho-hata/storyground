import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function DELETE(
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

  await prisma.project.delete({ where: { id: params.id } });

  return new Response(null, { status: 204 });
}
