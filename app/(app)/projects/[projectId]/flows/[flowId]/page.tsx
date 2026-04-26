import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import FlowEditor from "@/components/flows/FlowEditor";
import type { FlowData, FlowNodeData, FlowEdgeData } from "@/lib/types";

export default async function FlowPage({
  params,
}: {
  params: { projectId: string; flowId: string };
}) {
  const session = await auth();

  const flow = await prisma.flow.findFirst({
    where: {
      id: params.flowId,
      projectId: params.projectId,
      project: { ownerId: session!.user.id },
    },
    include: {
      project: { select: { id: true, name: true } },
      nodes: {
        include: {
          story: { select: { id: true, storyId: true, title: true, url: true } },
        },
      },
      edges: true,
    },
  });

  if (!flow) notFound();

  const stories = await prisma.story.findMany({
    where: { projectId: params.projectId },
    select: { id: true, storyId: true, title: true, url: true },
    orderBy: { title: "asc" },
  });

  const flowData: FlowData = {
    id: flow.id,
    projectId: flow.projectId,
    name: flow.name,
    description: flow.description,
    nodes: flow.nodes.map(
      (n): FlowNodeData => ({
        id: n.id,
        storyId: n.storyId,
        story: n.story,
        x: n.x,
        y: n.y,
        width: n.width,
        height: n.height,
      }),
    ),
    edges: flow.edges.map(
      (e): FlowEdgeData => ({
        id: e.id,
        fromNodeId: e.fromNodeId,
        toNodeId: e.toNodeId,
        sourceHandle: e.sourceHandle,
        targetHandle: e.targetHandle,
        label: e.label,
      }),
    ),
    createdAt: flow.createdAt.toISOString(),
    updatedAt: flow.updatedAt.toISOString(),
  };

  return (
    <div className="flex flex-col h-[calc(100vh-53px)]">
      <div className="border-b border-gray-800 bg-gray-900 px-4 py-2 flex items-center gap-3 shrink-0">
        <Link
          href={`/projects/${params.projectId}`}
          className="text-gray-500 hover:text-gray-300 text-sm"
        >
          ← {flow.project.name}
        </Link>
        <span className="text-gray-700">/</span>
        <span className="text-sm text-gray-300">{flow.name}</span>
      </div>
      <FlowEditor flow={flowData} stories={stories} />
    </div>
  );
}
