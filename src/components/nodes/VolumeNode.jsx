import { memo } from "react";
import { Handle, Position } from "reactflow";

function VolumeNode({ data, selected }) {
  return (
    <div
      className={`
        min-w-[140px] rounded-lg border-2 px-4 py-3 text-center
        ${selected ? "border-orange-400 shadow-lg shadow-orange-500/20" : "border-orange-600"}
        bg-orange-950/40
      `}
    >
      <div className="flex items-center justify-center gap-1.5">
        <span className="text-sm">💾</span>
        <span className="text-xs font-bold text-orange-300">{data.name}</span>
      </div>
      <div className="text-[10px] text-orange-500 mt-0.5">
        {data.external ? "external" : data.driver || "local"}
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
