import ReactFlow, { Background, Controls, MiniMap } from "reactflow";
import "reactflow/dist/style.css";

import { nodeTypes } from "./nodes";
import { edgeTypes } from "./edges";
import EmptyState from "./EmptyState";
import KeyboardHelp from "./KeyboardHelp";

export default function EditorCanvas({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onConnect,
  onNodeClick,
  onPaneClick,
}) {
  const isEmpty = nodes.length === 0;

  return (
    <div className="relative w-full h-full bg-slate-950">
      {isEmpty && <EmptyState />}

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
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#334155" gap={20} size={1} variant="dots" />
        <Controls position="bottom-left" showInteractive={false} />
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
          pannable
          zoomable
        />
      </ReactFlow>

      <KeyboardHelp />
    </div>
  );
}
