import { useState, useEffect } from "react";

export default function NetworkPanel({ node, onUpdate, onDelete, onClose }) {
  const [form, setForm] = useState({
    name: "",
    driver: "bridge",
    external: false,
  });

  useEffect(() => {
    if (!node) return;
    setForm({
      name: node.data.name || "",
      driver: node.data.driver || "bridge",
      external: node.data.external || false,
    });
  }, [node]);

  const handleSave = () => {
    onUpdate(node.id, { ...form });
  };

  const inputClass =
    "w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-green-500";

  const labelClass =
    "block text-[11px] text-slate-500 uppercase tracking-wider mb-1";

  return (
    <div className="w-80 h-full bg-slate-800 border-l border-slate-700 flex flex-col">
      <div className="px-4 py-3 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>🌐</span>
          <span className="text-sm font-bold text-green-300">
            네트워크 편집
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-300 text-lg"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        <div>
          <label className={labelClass}>네트워크 이름</label>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="app-network"
          />
        </div>

        <div>
          <label className={labelClass}>드라이버</label>
          <select
            className={inputClass}
            value={form.driver}
            onChange={(e) => setForm({ ...form, driver: e.target.value })}
          >
            <option value="bridge">bridge</option>
            <option value="host">host</option>
            <option value="overlay">overlay</option>
            <option value="none">none</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="net-external"
            checked={form.external}
            onChange={(e) => setForm({ ...form, external: e.target.checked })}
            className="accent-green-500"
          />
          <label htmlFor="net-external" className="text-sm text-slate-300">
            external 네트워크
          </label>
        </div>
      </div>

      <div className="px-4 py-3 border-t border-slate-700 space-y-2">
        <button
          onClick={handleSave}
          className="w-full bg-green-600 hover:bg-green-500 text-white text-sm font-medium py-2 rounded transition-colors"
        >
          💾 저장
        </button>
        <button
          onClick={() => onDelete(node.id)}
          className="w-full bg-red-900/40 hover:bg-red-900/70 text-red-400 text-sm font-medium py-2 rounded transition-colors"
        >
          🗑️ 네트워크 삭제
        </button>
      </div>
    </div>
  );
}
