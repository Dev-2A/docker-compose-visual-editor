import { useState } from "react";

export default function KeyboardHelp() {
  const [open, setOpen] = useState(false);

  const shortcuts = [
    { key: "Delete", desc: "선택한 노드/엣지 삭제" },
    { key: "Ctrl + C", desc: "노드 복사 (ReactFlow 기본)" },
    { key: "Ctrl + Z", desc: "실행 취소 (ReactFlow 기본)" },
    { key: "Scroll", desc: "줌 인/아웃" },
    { key: "Drag", desc: "노드 이동 / 캔버스 패닝" },
  ];

  return (
    <div className="absolute bottom-4 right-4 z-20">
      {open && (
        <div className="mb-2 bg-slate-800/95 border border-slate-700 rounded-lg p-3 shadow-xl backdrop-blur-sm panel-slide-in">
          <div className="text-xs font-bold text-slate-300 mb-2">⌨️ 단축키</div>
          <div className="space-y-1.5">
            {shortcuts.map((s) => (
              <div key={s.key} className="flex items-center gap-2">
                <kbd className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded font-mono min-w-[60px] text-center">
                  {s.key}
                </kbd>
                <span className="text-[11px] text-slate-400">{s.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={`
          w-8 h-8 rounded-full flex items-center justify-center text-sm
          transition-colors shadow-lg
          ${
            open
              ? "bg-slate-600 text-slate-200"
              : "bg-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-700"
          }
          border border-slate-700
        `}
        title="단축키 도움말"
      >
        ?
      </button>
    </div>
  );
}
