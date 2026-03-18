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
import { edgeTypes } from "./edges";
import { parseComposeYaml } from "../utils/yamlParser";
import { sampleComposeYaml } from "../data/sampleCompose";

export default function EditorCanvas() {
  const parsed = useMemo(() => {
    try {
      return parseComposeYaml(sampleComposeYaml);
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
        edgeTypes={edgeTypes}
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
