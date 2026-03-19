export default function EmptyState() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <div className="text-center space-y-4 opacity-40">
        <div className="text-6xl">🐳</div>
        <div className="space-y-1">
          <p className="text-lg font-semibold text-slate-400">
            Docker Compose Visual Editor
          </p>
          <p className="text-sm text-slate-500">
            상단 버튼으로 서비스를 추가하거나, YAML 파일을 임포트하세요
          </p>
        </div>
        <div className="flex justify-center gap-4 text-xs text-slate-600">
          <span>🐳 서비스</span>
          <span>🌐 네트워크</span>
          <span>💾 볼륨</span>
        </div>
        <div className="text-xs text-slate-600 space-y-0.5">
          <p>📂 .yml 파일을 임포트하면 자동으로 시각화됩니다</p>
          <p>노드 간 드래그로 연결 · Delete 키로 삭제</p>
        </div>
      </div>
    </div>
  );
}
