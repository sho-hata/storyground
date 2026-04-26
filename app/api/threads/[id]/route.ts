import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { status, x, y } = await req.json();

  const data: { status?: "open" | "resolved"; x?: number; y?: number } = {};

  if (status !== undefined) {
    if (status !== "open" && status !== "resolved") {
      return Response.json({ error: "status must be open or resolved" }, { status: 400 });
    }
    data.status = status;
  }
  if (x !== undefined) data.x = x;
  if (y !== undefined) data.y = y;

  if (Object.keys(data).length === 0) {
    return Response.json({ error: "no fields to update" }, { status: 400 });
  }

  const thread = await prisma.commentThread.update({
    where: { id: params.id },
    data,
  });

  return Response.json(thread);
}
