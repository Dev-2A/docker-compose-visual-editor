import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";

import { nodeTypes } from "./nodes";
import { edgeTypes } from "./edges";

export default function EditorCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick,
}) {
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
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        deleteKeyCode={["Backspace", "Delete"]}
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
