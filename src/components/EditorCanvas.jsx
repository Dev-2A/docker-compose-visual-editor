import { useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";

import { parseComposeYaml } from "../utils/yamlParser";
import { sampleComposeYaml } from "../data/sampleCompose";

// 임시 스타일 매핑 (Step 4에서 커스텀 노드로 교체 예정)
function applyTempStyles(nodes, edges) {
  const styleMap = {
    serviceNode: {
      background: "#1e293b",
      color: "#e2e8f0",
      border: "2px solid #3b82f6",
      borderRadius: "8px",
      padding: "12px",
      fontSize: "13px",
    },
    networkNode: {
      background: "#052e16",
      color: "#86efac",
      border: "2px solid #22c55e",
      borderRadius: "20px",
      padding: "10px",
      fontSize: "12px",
    },
    volumeNode: {
      background: "#1c1917",
      color: "#fed7aa",
      border: "2px solid #f97316",
      borderRadius: "8px",
      padding: "10px",
      fontSize: "12px",
    },
  };

  const edgeStyleMap = {
    networkEdge: { stroke: "#22c55e", strokeWidth: 2 },
    volumeEdge: { stroke: "#f97316", strokeWidth: 2 },
    dependsEdge: {
      stroke: "#64748b",
      strokeWidth: 1.5,
      strokeDasharray: "5 5",
    },
  };

  const labelMap = {
    networkEdge: "#22c55e",
    volumeEdge: "#f97316",
    dependsEdge: "#64748b",
  };

  const iconMap = {
    serviceNode: "🐳",
    networkNode: "🌐",
    volumeNode: "💾",
  };

  const styledNodes = nodes.map((n) => ({
    ...n,
    type: "default",
    data: {
      label: `${iconMap[n.type] || ""} ${n.data.name}${n.data.image ? ` (${n.data.image})` : ""}`,
    },
    style: styleMap[n.type] || {},
  }));

  const styledEdges = edges.map((e) => ({
    ...e,
    type: "default",
    label: e.data.name,
    style: edgeStyleMap[e.type] || {},
    labelStyle: {
      fill: labelMap[e.type] || "#94a3b8",
      fontSize: 11,
    },
  }));

  return { nodes: styledNodes, edges: styledEdges };
}

export default function EditorCanvas() {
  const parsed = useMemo(() => {
    try {
      const result = parseComposeYaml(sampleComposeYaml);
      return applyTempStyles(result.nodes, result.edges);
    } catch (err) {
      console.error("YAML 파싱 오류:", err);
      return { nodes: [], edges: [] };
    }
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(parsed.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(parsed.edges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div className="w-full h-full bg-slate-950">
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
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            if (node.style?.border?.includes("#3b82f6")) return "#3b82f6";
            if (node.style?.border?.includes("#22c55e")) return "#22c55e";
            if (node.style?.border?.includes("#f97316")) return "#f97316";
            return "#64748b";
          }}
          maskColor="rgba(0, 0, 0, 0.7)"
          style={{ backgroundColor: "#0f172a" }}
        />
      </ReactFlow>
    </div>
  );
}
