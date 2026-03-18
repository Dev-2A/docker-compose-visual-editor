import { useCallback, useState } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes = [
  {
    id: "service-1",
    type: "default",
    position: { x: 100, y: 100 },
    data: { label: "🐳 web (nginx:latest)" },
    style: {
      background: "#1e293b",
      color: "#e2e8f0",
      border: "1px solid #3b82f6",
      borderRadius: "8px",
      padding: "10px",
    },
  },
  {
    id: "service-2",
    type: "default",
    position: { x: 400, y: 100 },
    data: { label: "🐳 api (node:18-alpine)" },
    style: {
      background: "#1e293b",
      color: "#e2e8f0",
      border: "1px solid #3b82f6",
      borderRadius: "8px",
      padding: "10px",
    },
  },
  {
    id: "service-3",
    type: "default",
    position: { x: 400, y: 300 },
    data: { label: "🐳 db (postgres:15)" },
    style: {
      background: "#1e293b",
      color: "#e2e8f0",
      border: "1px solid #3b82f6",
      borderRadius: "8px",
      padding: "10px",
    },
  },
];

const initialEdges = [
  {
    id: "e-1-2",
    source: "service-1",
    target: "service-2",
    label: "app-network",
    style: { stroke: "#22c55e" },
    labelStyle: { fill: "#22c55e", fontSize: 12 },
  },
  {
    id: "e-2-3",
    source: "service-2",
    target: "service-3",
    label: "db-network",
    style: { stroke: "#22c55e" },
    labelStyle: { fill: "#22c55e", fontSize: 12 },
  },
];

export default function EditorCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="w-full h-screen bg-slate-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#334155" gap={20} size={1} />
        <Controls
          style={{
            button: { backgroundColor: "#1e293b", color: "#e2e8f0" },
          }}
        />
        <MiniMap
          nodeColor="#3b82f6"
          maskColor="rgba(0, 0, 0, 0.7)"
          style={{ backgroundColor: "#0f172a" }}
        />
      </ReactFlow>
    </div>
  );
}
