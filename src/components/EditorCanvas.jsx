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

import { nodeTypes } from "./nodes";
import { parseComposeYaml } from "../utils/yamlParser";
import { sampleComposeYaml } from "../data/sampleCompose";

// 엣지 임시 스타일 (Step 5에서 커스텀 엣지로 교체 예정)
function applyEdgeStyles(edges) {
  const edgeStyleMap = {
    networkEdge: { stroke: "#22c55e", strokeWidth: 2 },
    volumeEdge: { stroke: "#f97316", strokeWidth: 2 },
    dependsEdge: {
      stroke: "#64748b",
      strokeWidth: 1.5,
      strokeDasharray: "5 5",
    },
  };

  const labelColorMap = {
    networkEdge: "#22c55e",
    volumeEdge: "#f97316",
    dependsEdge: "#64748b",
  };

  return edges.map((e) => ({
    ...e,
    type: "default",
    label: e.data?.name || "",
    style: edgeStyleMap[e.type] || {},
    labelStyle: {
      fill: labelColorMap[e.type] || "#94a3b8",
      fontSize: 11,
    },
  }));
}

export default function EditorCanvas() {
  const parsed = useMemo(() => {
    try {
      const result = parseComposeYaml(sampleComposeYaml);
      return {
        nodes: result.nodes, // 커스텀 노드 타입 그대로 사용
        edges: applyEdgeStyles(result.edges),
      };
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
        nodeTypes={nodeTypes}
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
            const type = node.type;
            if (type === "serviceNode") return "#3b82f6";
            if (type === "networkNode") return "#22c55e";
            if (type === "volumeNode") return "#f97316";
            return "#64748b";
          }}
          maskColor="rgba(0, 0, 0, 0.7)"
          style={{ backgroundColor: "#0f172a" }}
        />
      </ReactFlow>
    </div>
  );
}
