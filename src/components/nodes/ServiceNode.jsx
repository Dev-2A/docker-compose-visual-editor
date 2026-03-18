import { memo } from "react";
import { Handle, Position } from "reactflow";

function ServiceNode({ data, selected }) {
  const ports = data.ports || [];
  const envCount = Array.isArray(data.environment)
    ? data.environment.length
    : typeof data.environment === "object"
      ? Object.keys(data.environment).length
      : 0;
  const deps = data.depends_on || [];
  const hasRestart = !!data.restart;

  return (
    <div
      className={`
        min-w-[200px] rounded-lg border-2 overflow-hidden
        ${selected ? "border-blue-400 shadow-lg shadow-blue-500/20" : "border-blue-600"}
        bg-slate-800
      `}
    >
      {/* 헤더 */}
      <div className="bg-blue-600/20 px-3 py-2 flex items-center gap-2 border-b border-slate-700">
        <span className="text-base">🐳</span>
        <span className="text-sm font-bold text-blue-300 truncate">
          {data.name}
        </span>
        {hasRestart && (
          <span className="ml-auto text-[10px] bg-blue-600/30 text-blue-300 px-1.5 py-0.5 rounded">
            🔄 {data.restart}
          </span>
        )}
      </div>

      {/* 본문 */}
      <div className="px-3 py-2 space-y-1.5">
        {/* 이미지 또는 빌드 */}
        {data.image && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-500 w-10">IMAGE</span>
            <span className="text-xs text-slate-300 font-mono truncate">
              {data.image}
            </span>
          </div>
        )}
        {data.build && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-500 w-10">BUILD</span>
            <span className="text-xs text-slate-300 font-mono truncate">
              {typeof data.build === "string"
                ? data.build
                : data.build.context || "."}
            </span>
          </div>
        )}

        {/* 포트 */}
        {ports.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-500 w-10">PORTS</span>
            <div className="flex flex-wrap gap-1">
              {ports.map((p, i) => (
                <span
                  key={i}
                  className="text-[10px] bg-cyan-900/40 text-cyan-300 px-1.5 py-0.5 rounded font-mono"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 하단 뱃지 */}
        <div className="flex gap-1.5 pt-1">
          {envCount > 0 && (
            <span className="text-[10px] bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">
              🔑 env ×{envCount}
            </span>
          )}
          {deps.length > 0 && (
            <span className="text-[10px] bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">
              ⬆️ deps ×{deps.length}
            </span>
          )}
        </div>
      </div>

      {/* 핸들 */}
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
