export default function Header() {
  return (
    <header className="h-12 bg-slate-900 border-b border-slate-700 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <span className="text-xl">🐳</span>
        <h1 className="text-sm font-bold text-slate-200">
          Docker Compose Visual Editor
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-slate-500">v0.1.0-dev</span>
      </div>
    </header>
  );
}
