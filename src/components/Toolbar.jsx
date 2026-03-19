import { useRef } from "react";
import { readYamlFile, downloadYamlFile } from "../utils/fileHandlers";
import { generateComposeYaml } from "../utils/YamlGenerator";

export default function Toolbar({ nodes, edges, onLoad }) {
  const fileInputRef = useRef(null);

  // 파일 업로드 (임포트)
  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const yamlString = await readYamlFile(file);
      const result = onLoad(yamlString);
      if (!result.success) {
        alert(`파싱 오류: ${result.error}`);
      }
    } catch (err) {
      alert(err.message);
    }

    // 같은 파일 재선택 가능하도록 초기화
    e.target.value = "";
  };

  // 파일 다운로드 (익스포트)
  const handleExport = () => {
    try {
      const yamlString = generateComposeYaml(nodes, edges);
      downloadYamlFile(yamlString);
    } catch (err) {
      alert(`YAML 생성 오류: ${err.message}`);
    }
  };

  // 캔버스 초기화
  const handleClear = () => {
    if (!confirm("모든 노드와 엣지를 삭제하시겠습니까?")) return;
    onLoad("services: {}");
  };

  return (
    <div className="h-10 bg-slate-900/60 border-b border-slate-800 flex items-center px-4 gap-2">
      {/* 임포트 */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".yml,.yaml"
        onChange={handleImport}
        className="hidden"
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium px-2.5 py-1.5 rounded transition-colors"
      >
        📂 임포트
      </button>

      {/* 익스포트 */}
      <button
        onClick={handleExport}
        className="flex items-center gap-1 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs font-medium px-2.5 py-1.5 rounded transition-colors"
      >
        💾 익스포트
      </button>

      <div className="w-px h-5 bg-slate-700" />

      {/* 캔버스 초기화 */}
      <button
        onClick={handleClear}
        className="flex items-center gap-1 bg-slate-800 hover:bg-red-900/50 text-slate-500 hover:text-red-400 text-xs font-medium px-2.5 py-1.5 rounded transition-colors"
      >
        🗑️ 초기화
      </button>

      <div className="flex-1" />

      {/* 노드 카운트 */}
      <div className="flex items-center gap-3 text-[11px] text-slate-500">
        <span>🐳 {nodes.filter((n) => n.type === "serviceNode").length}</span>
        <span>🌐 {nodes.filter((n) => n.type === "networkNode").length}</span>
        <span>💾 {nodes.filter((n) => n.type === "volumeNode").length}</span>
        <span>🔗 {edges.length}</span>
      </div>
    </div>
  );
}
