import { memo } from "react";
import { getBezierPath, EdgeLabelRenderer } from "reactflow";

function NetworkEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        className="react-flow__edge-path"
        d={edgePath}
        style={{
          stroke: selected ? "#4ade80" : "#22c55e",
          strokeWidth: selected ? 3 : 2,
          fill: "none",
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: "all",
          }}
          className={`
            flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono
            ${selected ? "bg-green-800 text-green-200" : "bg-green-950/80 text-green-400"}
            border border-green-700/50
          `}
        >
          <span>🌐</span>
          <span>{data?.name || ""}</span>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(NetworkEdge);
