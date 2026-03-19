export default function Header({ onAddService, onAddNetwork, onAddVolume }) {
  const handleAdd = (type, label, callback) => {
    const name = prompt(`${label} 이름을 입력하세요:`);
    if (name && name.trim()) callback(name.trim());
  };

  return (
    <header className="h-12 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">🐳</span>
        <h1 className="text-sm font-bold text-slate-200">
          Docker Compose Visual Editor
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handleAdd("service", "서비스", onAddService)}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3 py-1.5 rounded transition-colors"
        >
          🐳 + 서비스
        </button>
        <button
          onClick={() => handleAdd("network", "네트워크", onAddNetwork)}
          className="bg-green-700 hover:bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded transition-colors"
        >
          🌐 + 네트워크
        </button>
        <button
          onClick={() => handleAdd("volume", "볼륨", onAddVolume)}
          className="bg-orange-700 hover:bg-orange-600 text-white text-xs font-medium px-3 py-1.5 rounded transition-colors"
        >
          💾 + 볼륨
        </button>
        <div className="w-px h-5 bg-slate-700 mx-1" />
        <span className="text-xs text-slate-500">v0.1.0-dev</span>
      </div>
    </header>
  );
}
