export default function Header({ onAddService }) {
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
          onClick={() => {
            const name = prompt("서비스 이름을 입력하세요:");
            if (name && name.trim()) onAddService(name.trim());
          }}
          className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium px-3 py-1.5 rounded transition-colors"
        >
          + 서비스 추가
        </button>
        <span className="text-xs text-slate-500">v0.1.0-dev</span>
      </div>
    </header>
  );
}
