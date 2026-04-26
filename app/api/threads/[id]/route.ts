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

  const { status } = await req.json();
  if (status !== "open" && status !== "resolved") {
    return Response.json({ error: "status must be open or resolved" }, { status: 400 });
  }

  const thread = await prisma.commentThread.update({
    where: { id: params.id },
    data: { status },
  });

  return Response.json(thread);
}
