import { memo } from "react";
import { getBezierPath, EdgeLabelRenderer } from "reactflow";

function VolumeEdge({
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
          stroke: selected ? "#fb923c" : "#f97316",
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
            ${selected ? "bg-orange-800 text-orange-200" : "bg-orange-950/80 text-orange-400"}
            border border-orange-700/50
          `}
        >
          <span>💾</span>
          <span>{data?.name || ""}</span>
          {data?.mount && (
            <span className="text-orange-600">→ {data.mount}</span>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(VolumeEdge);
