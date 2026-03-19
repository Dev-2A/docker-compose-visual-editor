import { memo } from "react";
import { Handle, Position } from "reactflow";

function NetworkNode({ data, selected }) {
  return (
    <div
      className={`
        node-appear min-w-[140px] rounded-full border-2 px-5 py-3 text-center
        transition-shadow duration-150
        ${
          selected
            ? "border-green-400 shadow-lg shadow-green-500/25"
            : "border-green-600/70 hover:border-green-500 hover:shadow-md hover:shadow-green-500/10"
        }
        bg-green-950/50
      `}
    >
      <div className="flex items-center justify-center gap-1.5">
        <span className="text-sm">🌐</span>
        <span className="text-xs font-bold text-green-300">{data.name}</span>
      </div>
      <div className="text-[10px] text-green-500/80 mt-0.5">
        {data.external ? "🔗 external" : data.driver || "bridge"}
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-green-500 !w-2.5 !h-2.5 !border-2 !border-green-950"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-green-500 !w-2.5 !h-2.5 !border-2 !border-green-950"
      />
    </div>
  );
}

export default memo(NetworkNode);
