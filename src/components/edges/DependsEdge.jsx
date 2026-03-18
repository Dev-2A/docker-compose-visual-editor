import { memo } from "react";
import { getBezierPath, EdgeLabelRenderer } from "reactflow";

function DependsEdge({
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
          stroke: selected ? "#94a3b8" : "#64748b",
          strokeWidth: selected ? 2.5 : 1.5,
          strokeDasharray: "6 4",
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
            flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px]
            ${selected ? "bg-slate-700 text-slate-200" : "bg-slate-900/80 text-slate-500"}
            border border-slate-700/50
          `}
        >
          <span>⬆️</span>
          <span>depends_on</span>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(DependsEdge);
