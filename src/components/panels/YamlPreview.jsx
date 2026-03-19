import { useMemo, useState } from "react";
import { generateComposeYaml } from "../../utils/YamlGenerator";

export default function YamlPreview({ nodes, edges, onClose, onLoad }) {
  const [mode, setMode] = useState("preview"); // 'preview' | 'edit'
  const [editText, setEditText] = useState("");

  const yamlString = useMemo(() => {
    try {
      return generateComposeYaml(nodes, edges);
    } catch (err) {
      return `# 오류: ${err.message}`;
    }
  }, [nodes, edges]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(yamlString);
      alert("클립보드에 복사되었습니다!");
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = yamlString;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      alert("클립보드에 복사되었습니다!");
    }
  };

  const handleSwitchToEdit = () => {
    setEditText(yamlString);
    setMode("edit");
  };

  const handleApplyEdit = () => {
    const result = onLoad(editText);
    if (result.success) {
      setMode("preview");
    } else {
      alert(`파싱 오류: ${result.error}`);
    }
  };

  return (
    <div className="w-96 h-full bg-slate-800 border-l border-slate-700 flex flex-col">
      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>📄</span>
          <span className="text-sm font-bold text-slate-200">
            docker-compose.yml
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-300 text-lg"
        >
          ✕
        </button>
      </div>

      {/* 탭 */}
      <div className="flex border-b border-slate-700">
        <button
          onClick={() => setMode("preview")}
          className={`flex-1 text-xs py-2 transition-colors ${
            mode === "preview"
              ? "text-blue-400 border-b-2 border-blue-400 bg-slate-900/50"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          👀 미리보기
        </button>
        <button
          onClick={handleSwitchToEdit}
          className={`flex-1 text-xs py-2 transition-colors ${
            mode === "edit"
              ? "text-blue-400 border-b-2 border-blue-400 bg-slate-900/50"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          ✏️ 편집
        </button>
      </div>

      {/* 본문 */}
      <div className="flex-1 overflow-hidden">
        {mode === "preview" ? (
          <pre className="h-full overflow-auto p-4 text-xs font-mono text-green-400 bg-slate-950 leading-relaxed whitespace-pre">
            {yamlString}
          </pre>
        ) : (
          <textarea
            className="w-full h-full p-4 text-xs font-mono text-yellow-300 bg-slate-950 border-none resize-none focus:outline-none leading-relaxed"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            spellCheck={false}
          />
        )}
      </div>

      {/* 하단 버튼 */}
      <div className="px-4 py-3 border-t border-slate-700 flex gap-2">
        {mode === "preview" ? (
          <button
            onClick={handleCopy}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-medium py-2 rounded transition-colors"
          >
            📋 복사
          </button>
        ) : (
          <button
            onClick={handleApplyEdit}
            className="flex-1 bg-yellow-600 hover:bg-yellow-500 text-white text-xs font-medium py-2 rounded transition-colors"
          >
            ⚡ YAML 적용
          </button>
        )}
      </div>
    </div>
  );
}
