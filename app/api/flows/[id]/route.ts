import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import type { FlowNodeInput, FlowEdgeInput } from "@/lib/types";

async function loadFlowOwned(flowId: string, userId: string) {
  return prisma.flow.findFirst({
    where: { id: flowId, project: { ownerId: userId } },
    select: { id: true, projectId: true },
  });
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const flow = await prisma.flow.findFirst({
    where: { id: params.id, project: { ownerId: session.user.id } },
    include: {
      nodes: {
        include: {
          story: { select: { id: true, storyId: true, title: true, url: true } },
        },
      },
      edges: true,
    },
  });
  if (!flow) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json(flow);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const owned = await loadFlowOwned(params.id, session.user.id);
  if (!owned) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const body = (await req.json()) as {
    name?: string;
    description?: string | null;
    nodes?: FlowNodeInput[];
    edges?: FlowEdgeInput[];
  };

  const nodes = body.nodes ?? [];
  const edges = body.edges ?? [];

  const seenNodeIds = new Set<string>();
  for (const n of nodes) {
    if (!n.id || !n.storyId) {
      return Response.json({ error: "node.id and node.storyId required" }, { status: 400 });
    }
    if (seenNodeIds.has(n.id)) {
      return Response.json({ error: "duplicate node id" }, { status: 400 });
    }
    seenNodeIds.add(n.id);
  }

  for (const e of edges) {
    if (!e.id || !e.fromNodeId || !e.toNodeId) {
      return Response.json({ error: "edge.id, fromNodeId, toNodeId required" }, { status: 400 });
    }
    if (!seenNodeIds.has(e.fromNodeId) || !seenNodeIds.has(e.toNodeId)) {
      return Response.json({ error: "edge references unknown node" }, { status: 400 });
    }
  }

  await prisma.$transaction(async (tx) => {
    if (body.name !== undefined || body.description !== undefined) {
      await tx.flow.update({
        where: { id: params.id },
        data: {
          ...(body.name !== undefined ? { name: body.name } : {}),
          ...(body.description !== undefined ? { description: body.description } : {}),
        },
      });
    }

    const existingNodes = await tx.flowNode.findMany({
      where: { flowId: params.id },
      select: { id: true },
    });
    const existingNodeIds = new Set(existingNodes.map((n) => n.id));
    const incomingNodeIds = new Set(nodes.map((n) => n.id));

    const existingEdges = await tx.flowEdge.findMany({
      where: { flowId: params.id },
      select: { id: true },
    });
    const existingEdgeIds = new Set(existingEdges.map((e) => e.id));
    const incomingEdgeIds = new Set(edges.map((e) => e.id));

    const edgesToDelete = Array.from(existingEdgeIds).filter((id) => !incomingEdgeIds.has(id));
    if (edgesToDelete.length > 0) {
      await tx.flowEdge.deleteMany({ where: { id: { in: edgesToDelete } } });
    }

    const nodesToDelete = Array.from(existingNodeIds).filter((id) => !incomingNodeIds.has(id));
    if (nodesToDelete.length > 0) {
      await tx.flowNode.deleteMany({ where: { id: { in: nodesToDelete } } });
    }

    for (const n of nodes) {
      if (existingNodeIds.has(n.id)) {
        await tx.flowNode.update({
          where: { id: n.id },
          data: { x: n.x, y: n.y, width: n.width, height: n.height, storyId: n.storyId },
        });
      } else {
        await tx.flowNode.create({
          data: {
            id: n.id,
            flowId: params.id,
            storyId: n.storyId,
            x: n.x,
            y: n.y,
            width: n.width,
            height: n.height,
          },
        });
      }
    }

    for (const e of edges) {
      if (existingEdgeIds.has(e.id)) {
        await tx.flowEdge.update({
          where: { id: e.id },
          data: {
            fromNodeId: e.fromNodeId,
            toNodeId: e.toNodeId,
            sourceHandle: e.sourceHandle ?? null,
            targetHandle: e.targetHandle ?? null,
            label: e.label ?? null,
          },
        });
      } else {
        await tx.flowEdge.create({
          data: {
            id: e.id,
            flowId: params.id,
            fromNodeId: e.fromNodeId,
            toNodeId: e.toNodeId,
            sourceHandle: e.sourceHandle ?? null,
            targetHandle: e.targetHandle ?? null,
            label: e.label ?? null,
          },
        });
      }
    }
  });

  const flow = await prisma.flow.findUnique({
    where: { id: params.id },
    include: {
      nodes: {
        include: {
          story: { select: { id: true, storyId: true, title: true, url: true } },
        },
      },
      edges: true,
    },
  });

  return Response.json(flow);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const owned = await loadFlowOwned(params.id, session.user.id);
  if (!owned) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.flow.delete({ where: { id: params.id } });
  return new Response(null, { status: 204 });
}
