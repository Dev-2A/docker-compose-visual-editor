import { useState, useEffect } from "react";

export default function ServicePanel({ node, onUpdate, onDelete, onClose }) {
  const [form, setForm] = useState({
    name: "",
    image: "",
    ports: "",
    environment: "",
    restart: "",
    command: "",
  });

  useEffect(() => {
    if (!node) return;
    const d = node.data;
    setForm({
      name: d.name || "",
      image: d.image || "",
      ports: (d.ports || []).join(", "),
      environment: Array.isArray(d.environment)
        ? d.environment.join("\n")
        : typeof d.environment === "object"
          ? Object.entries(d.environment)
              .map(([k, v]) => `${k}=${v}`)
              .join("\n")
          : "",
      restart: d.restart || "",
      command: d.command || "",
    });
  }, [node]);

  const handleSave = () => {
    const ports = form.ports
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);
    const environment = form.environment
      .split("\n")
      .map((e) => e.trim())
      .filter(Boolean);

    onUpdate(node.id, {
      name: form.name,
      image: form.image,
      ports,
      environment,
      restart: form.restart,
      command: form.command,
    });
  };

  const inputClass =
    "w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500";

  const labelClass =
    "block text-[11px] text-slate-500 uppercase tracking-wider mb-1";

  return (
    <div className="w-80 h-full bg-slate-800 border-l border-slate-700 flex flex-col">
      {/* 헤더 */}
      <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>🐳</span>
          <span className="text-sm font-bold text-blue-300">서비스 편집</span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-300 text-lg"
        >
          ✕
        </button>
      </div>

      {/* 폼 */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        <div>
          <label className={labelClass}>서비스 이름</label>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="web"
          />
        </div>

        <div>
          <label className={labelClass}>이미지</label>
          <input
            className={inputClass}
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="nginx:alpine"
          />
        </div>

        <div>
          <label className={labelClass}>포트 (쉼표 구분)</label>
          <input
            className={inputClass}
            value={form.ports}
            onChange={(e) => setForm({ ...form, ports: e.target.value })}
            placeholder="80:80, 443:443"
          />
        </div>

        <div>
          <label className={labelClass}>환경변수 (줄바꿈 구분)</label>
          <textarea
            className={`${inputClass} h-24 resize-none font-mono text-xs`}
            value={form.environment}
            onChange={(e) => setForm({ ...form, environment: e.target.value })}
            placeholder={"NODE_ENV=production\nDATABASE_URL=..."}
          />
        </div>

        <div>
          <label className={labelClass}>restart 정책</label>
          <select
            className={inputClass}
            value={form.restart}
            onChange={(e) => setForm({ ...form, restart: e.target.value })}
          >
            <option value="">없음</option>
            <option value="always">always</option>
            <option value="unless-stopped">unless-stopped</option>
            <option value="on-failure">on-failure</option>
            <option value="no">no</option>
          </select>
        </div>

        <div>
          <label className={labelClass}>command</label>
          <input
            className={inputClass}
            value={form.command}
            onChange={(e) => setForm({ ...form, command: e.target.value })}
            placeholder="npm start"
          />
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className="px-4 py-3 border-t border-slate-700 space-y-2">
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium py-2 rounded transition-colors"
        >
          💾 저장
        </button>
        <button
          onClick={() => onDelete(node.id)}
          className="w-full bg-red-900/40 hover:bg-red-900/70 text-red-400 text-sm font-medium py-2 rounded transition-colors"
        >
          🗑️ 서비스 삭제
        </button>
      </div>
    </div>
  );
}
