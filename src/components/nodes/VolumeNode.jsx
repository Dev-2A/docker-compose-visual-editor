import { memo } from "react";
import { Handle, Position } from "reactflow";

function VolumeNode({ data, selected }) {
  return (
    <div
      className={`
        node-appear min-w-[140px] rounded-lg border-2 px-5 py-3 text-center
        transition-shadow duration-150
        ${
          selected
            ? "border-orange-400 shadow-lg shadow-orange-500/25"
            : "border-orange-600/70 hover:border-orange-500 hover:shadow-md hover:shadow-orange-500/10"
        }
        bg-orange-950/30
      `}
    >
      <div className="flex items-center justify-center gap-1.5">
        <span className="text-sm">💾</span>
        <span className="text-xs font-bold text-orange-300">{data.name}</span>
      </div>
      <div className="text-[10px] text-orange-500/80 mt-0.5">
        {data.external ? "🔗 external" : data.driver || "local"}
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-orange-500 !w-2.5 !h-2.5 !border-2 !border-orange-950"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-orange-500 !w-2.5 !h-2.5 !border-2 !border-orange-950"
      />
    </div>
  );
}

export default memo(VolumeNode);
