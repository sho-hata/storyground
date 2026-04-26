"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import ReactFlow, {
  Background,
  ConnectionMode,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Edge,
  type Node,
  type NodeTypes,
} from "reactflow";
import "reactflow/dist/style.css";
import StoryNode, { type StoryNodeData } from "./StoryNode";
import FlowToolbar from "./FlowToolbar";
import StoryPickerDialog from "./StoryPickerDialog";
import type { FlowData, FlowNodeInput, FlowEdgeInput, FlowStoryRef } from "@/lib/types";

type RFNode = Node<StoryNodeData>;
type RFEdge = Edge;

interface Props {
  flow: FlowData;
  stories: FlowStoryRef[];
}

const nodeTypes: NodeTypes = { story: StoryNode };

function newId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `id_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

function toRFNodes(flow: FlowData): RFNode[] {
  return flow.nodes.map((n) => ({
    id: n.id,
    type: "story",
    position: { x: n.x, y: n.y },
    data: { story: n.story, projectId: flow.projectId },
    width: n.width,
    height: n.height,
  }));
}

function toRFEdges(flow: FlowData): RFEdge[] {
  return flow.edges.map((e) => ({
    id: e.id,
    source: e.fromNodeId,
    target: e.toNodeId,
    sourceHandle: e.sourceHandle ?? undefined,
    targetHandle: e.targetHandle ?? undefined,
    label: e.label ?? undefined,
  }));
}

function fromRFNodes(rfNodes: RFNode[]): FlowNodeInput[] {
  return rfNodes.map((n) => ({
    id: n.id,
    storyId: n.data.story.id,
    x: n.position.x,
    y: n.position.y,
    width: n.width ?? 240,
    height: n.height ?? 120,
  }));
}

function fromRFEdges(rfEdges: RFEdge[]): FlowEdgeInput[] {
  return rfEdges.map((e) => ({
    id: e.id,
    fromNodeId: e.source,
    toNodeId: e.target,
    sourceHandle: e.sourceHandle ?? null,
    targetHandle: e.targetHandle ?? null,
    label: typeof e.label === "string" ? e.label : null,
  }));
}

export default function FlowEditor({ flow, stories }: Props) {
  const router = useRouter();
  const [nodes, setNodes, onNodesChange] = useNodesState<StoryNodeData>(toRFNodes(flow));
  const [edges, setEdges, onEdgesChange] = useEdgesState(toRFEdges(flow));
  const [flowName, setFlowName] = useState(flow.name);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const usedStoryIds = useMemo(
    () => new Set(nodes.map((n) => n.data.story.id)),
    [nodes],
  );

  const handleNodesChange = useCallback(
    (changes: Parameters<typeof onNodesChange>[0]) => {
      onNodesChange(changes);
      const meaningful = changes.some(
        (c) => c.type === "position" ? c.dragging === false : c.type !== "select",
      );
      if (meaningful) setDirty(true);
    },
    [onNodesChange],
  );

  const handleEdgesChange = useCallback(
    (changes: Parameters<typeof onEdgesChange>[0]) => {
      onEdgesChange(changes);
      const meaningful = changes.some((c) => c.type !== "select");
      if (meaningful) setDirty(true);
    },
    [onEdgesChange],
  );

  const onConnect = useCallback(
    (c: Connection) => {
      if (!c.source || !c.target || c.source === c.target) return;
      setEdges((eds) => {
        const dup = eds.some(
          (e) =>
            e.source === c.source &&
            e.target === c.target &&
            (e.sourceHandle ?? null) === (c.sourceHandle ?? null) &&
            (e.targetHandle ?? null) === (c.targetHandle ?? null),
        );
        if (dup) return eds;
        return addEdge({ ...c, id: newId() }, eds);
      });
      setDirty(true);
    },
    [setEdges],
  );

  const handleAddStory = useCallback(
    (story: FlowStoryRef) => {
      const id = newId();
      const offset = nodes.length * 30;
      setNodes((ns) =>
        ns.concat({
          id,
          type: "story",
          position: { x: 100 + offset, y: 100 + offset },
          data: { story, projectId: flow.projectId },
          width: 240,
          height: 120,
        }),
      );
      setDirty(true);
    },
    [nodes.length, setNodes, flow.projectId],
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/flows/${flow.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nodes: fromRFNodes(nodes),
          edges: fromRFEdges(edges),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "保存に失敗しました");
        return;
      }
      setDirty(false);
    } finally {
      setSaving(false);
    }
  }, [flow.id, nodes, edges]);

  const handleRename = useCallback(async (name: string) => {
    setFlowName(name);
    const res = await fetch(`/api/flows/${flow.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, nodes: fromRFNodes(nodes), edges: fromRFEdges(edges) }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "名前の保存に失敗しました");
      setFlowName(flow.name);
    }
  }, [flow.id, flow.name, nodes, edges]);

  const handleDeleteFlow = useCallback(async () => {
    if (!confirm("このフローを削除しますか？")) return;
    const res = await fetch(`/api/flows/${flow.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push(`/projects/${flow.projectId}`);
    } else {
      setError("削除に失敗しました");
    }
  }, [flow.id, flow.projectId, router]);

  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <FlowToolbar
        flowName={flowName}
        dirty={dirty}
        saving={saving}
        onSave={handleSave}
        onAddStory={() => setPickerOpen(true)}
        onDeleteFlow={handleDeleteFlow}
        onRename={handleRename}
      />
      {error && (
        <div className="bg-red-900/40 border-b border-red-800 text-red-300 text-sm px-4 py-1.5">
          {error}
        </div>
      )}
      <div className="flex-1 min-h-0 bg-gray-950">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          connectionMode={ConnectionMode.Loose}
          fitView
          deleteKeyCode={["Backspace", "Delete"]}
        >
          <Background color="#1f2937" gap={20} />
          <Controls className="!bg-gray-900 !border-gray-700" />
          <MiniMap
            className="!bg-gray-900"
            nodeColor="#374151"
            maskColor="rgba(0,0,0,0.6)"
          />
        </ReactFlow>
      </div>
      <StoryPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={handleAddStory}
        stories={stories}
        usedStoryIds={usedStoryIds}
      />
    </div>
  );
}
