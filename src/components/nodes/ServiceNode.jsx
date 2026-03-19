import { memo } from "react";
import { Handle, Position } from "reactflow";

function ServiceNode({ data, selected }) {
  const ports = data.ports || [];
  const envCount = Array.isArray(data.environment)
    ? data.environment.length
    : typeof data.environment === "object"
      ? Object.keys(data.environment).length
      : 0;
  const deps = Array.isArray(data.depends_on)
    ? data.depends_on
    : typeof data.depends_on === "object"
      ? Object.keys(data.depends_on)
      : [];
  const hasRestart = !!data.restart;
  const volCount = (data.volumes || []).length;
  const netCount = (data.networks || []).length;

  return (
    <div
      className={`
        node-appear min-w-[220px] max-w-[280px] rounded-lg border-2 overflow-hidden
        transition-shadow duration-150
        ${
          selected
            ? "border-blue-400 shadow-lg shadow-blue-500/25"
            : "border-blue-600/70 hover:border-blue-500 hover:shadow-md hover:shadow-blue-500/10"
        }
        bg-slate-800
      `}
    >
      {/* 헤더 */}
      <div className="bg-blue-600/15 px-3 py-2 flex items-center gap-2 border-b border-slate-700/50">
        <span className="text-base">🐳</span>
        <span className="text-sm font-bold text-blue-300 truncate flex-1">
          {data.name}
        </span>
        {hasRestart && (
          <span className="text-[9px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded-full whitespace-nowrap">
            🔄 {data.restart}
          </span>
        )}
      </div>

      {/* 본문 */}
      <div className="px-3 py-2 space-y-1.5">
        {data.image && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-500 w-12 shrink-0">
              IMAGE
            </span>
            <span className="text-xs text-slate-300 font-mono truncate">
              {data.image}
            </span>
          </div>
        )}
        {data.build && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-500 w-12 shrink-0">
              BUILD
            </span>
            <span className="text-xs text-slate-300 font-mono truncate">
              {typeof data.build === "string"
                ? data.build
                : data.build.context || "."}
            </span>
          </div>
        )}

        {ports.length > 0 && (
          <div className="flex items-start gap-1.5">
            <span className="text-[10px] text-slate-500 w-12 shrink-0 pt-0.5">
              PORTS
            </span>
            <div className="flex flex-wrap gap-1">
              {ports.map((p, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-cyan-900/30 text-cyan-300 px-1.5 py-0.5 rounded font-mono"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 하단 뱃지 */}
        <div className="flex flex-wrap gap-1 pt-1">
          {envCount > 0 && (
            <span className="text-[10px] bg-slate-700/60 text-slate-400 px-1.5 py-0.5 rounded">
              🔑 ×{envCount}
            </span>
          )}
          {deps.length > 0 && (
            <span className="text-[10px] bg-slate-700/60 text-slate-400 px-1.5 py-0.5 rounded">
              ⬆️ ×{deps.length}
            </span>
          )}
          {netCount > 0 && (
            <span className="text-[10px] bg-green-900/30 text-green-400 px-1.5 py-0.5 rounded">
              🌐 ×{netCount}
            </span>
          )}
          {volCount > 0 && (
            <span className="text-[10px] bg-orange-900/30 text-orange-400 px-1.5 py-0.5 rounded">
              💾 ×{volCount}
            </span>
          )}
        </div>
      </div>

      <Handle
        type="target"
        position={Position.Top}
        className="!bg-blue-500 !w-2.5 !h-2.5 !border-2 !border-slate-800"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-blue-500 !w-2.5 !h-2.5 !border-2 !border-slate-800"
      />
    </div>
  );
}

export default memo(ServiceNode);
