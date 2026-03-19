# 🐳 Docker Compose Visual Editor

Docker Compose의 서비스, 네트워크, 볼륨을 **노드 그래프로 시각화**하고,  
드래그앤드롭으로 편집하여 `docker-compose.yml`을 자동으로 생성하는 **브라우저 기반 비주얼 에디터**입니다.

> 백엔드 없이 브라우저만으로 동작합니다. 에어갭(폐쇄망) 환경에서도 사용 가능합니다.

## 🌐 데모

👉 [https://Dev-2A.github.io/docker-compose-visual-editor/](https://Dev-2A.github.io/docker-compose-visual-editor/)

## ✨ 주요 기능

- **YAML → 그래프 시각화**: `docker-compose.yml` 파일을 업로드하면 서비스/네트워크/볼륨이 노드로 자동 배치
- **드래그앤드롭 편집**: 노드 이동, 연결선 드래그로 서비스 간 관계 설정
- **스마트 엣지 연결**: 서비스→네트워크는 초록, 서비스→볼륨은 주황, depends_on은 회색 점선으로 자동 구분
- **사이드패널 편집**: 노드 클릭 시 이미지, 포트, 환경변수, restart 등 상세 편집
- **실시간 YAML 생성**: 캔버스 상태가 `docker-compose.yml`로 실시간 변환
- **YAML 직접편집**: 미리보기 패널에서 YAML을 직접 수정하고 캔버스에 반영
- **파일 임포트/익스포트**: `.yml` 파일 업로드 & 다운로드
- **다크 테마**: 눈이 편한 슬레이트 다크 테마
- **GitHub Pages 배포**: 정적 호스팅, 설치 불필요

## 🔧 기술 스택

- **React 18** - UI 컴포넌트
- **Vite 5** - 빌드 도구
- **ReactFlow** - 노드 그래프 캔버스
- **js-yaml** - YAML 파싱/생성
- **Tailwind CSS 3** - 스타일링

## 📁 프로젝트 구조

```text
docker-compose-visual-editor/
├── src/
│   ├── components/
│   │   ├── nodes/
│   │   │   ├── ServiceNode.jsx      # 서비스 노드
│   │   │   ├── NetworkNode.jsx      # 네트워크 노드
│   │   │   ├── VolumeNode.jsx       # 볼륨 노드
│   │   │   └── index.js
│   │   ├── edges/
│   │   │   ├── NetworkEdge.jsx      # 네트워크 엣지 (초록 실선)
│   │   │   ├── VolumeEdge.jsx       # 볼륨 엣지 (주황 실선)
│   │   │   ├── DependsEdge.jsx      # 의존성 엣지 (회색 점선)
│   │   │   └── index.js
│   │   ├── panels/
│   │   │   ├── ServicePanel.jsx     # 서비스 편집 패널
│   │   │   ├── NetworkPanel.jsx     # 네트워크 편집 패널
│   │   │   ├── VolumePanel.jsx      # 볼륨 편집 패널
│   │   │   ├── SidePanel.jsx        # 패널 라우터
│   │   │   └── YamlPreview.jsx      # YAML 미리보기/편집
│   │   ├── EditorCanvas.jsx         # ReactFlow 캔버스
│   │   ├── Header.jsx               # 상단 헤더
│   │   ├── Toolbar.jsx              # 임포트/익스포트 툴바
│   │   ├── EmptyState.jsx           # 빈 캔버스 안내
│   │   └── KeyboardHelp.jsx         # 단축키 도움말
│   ├── hooks/
│   │   └── useCompose.js            # 상태 관리 훅
│   ├── utils/
│   │   ├── yamlParser.js            # YAML → 노드/엣지 변환
│   │   ├── yamlGenerator.js         # 노드/엣지 → YAML 변환
│   │   └── fileHandlers.js          # 파일 임포트/익스포트
│   ├── data/
│   │   └── sampleCompose.js         # 샘플 docker-compose.yml
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .github/
│   └── workflows/
│       └── deploy.yml               # GitHub Pages 자동 배포
└── README.md
```

## 🚀 로컬 실행

```bash
git clone https://github.com/Dev-2A/docker-compose-visual-editor.git
cd docker-compose-visual-editor
npm install
npm run dev
```

`http://localhost:5173` 에서 확인할 수 있습니다.

## 🎮 사용법

1. 상단 버튼으로 **서비스/네트워크/볼륨 노드**를 추가합니다
2. 노드 하단 핸들에서 드래그하여 다른 노드에 연결하면 **엣지가 자동 생성**됩니다
3. 노드를 클릭하면 우측 **사이드 패널**에서 상세 속성을 편집할 수 있습니다
4. `📄 YAML` 버튼으로 실시간 생성된 docker-compose.yml을 확인합니다
5. `📂 임포트`로 기존 .yml 파일을 불러오거나, `💾 익스포트`로 다운로드합니다

### 노드 타입별 시각화

| 타입 | 아이콘 | 색상 | 모양 |
| --- | --- | --- | --- |
| 서비스 | 🐳 | 파랑 | 카드형 (이미지, 포트, 환경변수 표시) |
| 네트워크 | 🌐 | 초록 | 원형 (드라이버 표시) |
| 볼륨 | 💾 | 주황 | 사각형 (드라이버 표시) |

### 엣지 타입별 구분

| 타입 | 색상 | 스타일 |
| --- | --- | --- |
| 네트워크 연결 | 🟢 초록 | 실선 |
| 볼륨 마운트 | 🟠 주황 | 실선 |
| depends_on | ⚪ 회색 | 점선 |

## ⌨️ 단축키

| 키 | 동작 |
| --- | --- |
| Delete | 선택한 노드/엣지 삭제 |
| Scroll | 줌 인/아웃 |
| Drag (캔버스) | 패닝 |
| Drag (노드) | 노드 이동 |
| Drag (핸들) | 엣지 연결 |

## 📝 개발 기록

| 단계 | 내용 |
| --- | --- |
| Step 1 | 프로젝트 초기 설정 (Vite + React + ReactFlow + js-yaml + Tailwind) |
| Step 2 | ReactFlow 기본 캔버스 및 디렉토리 구조 스캐폴딩 |
| Step 3 | YAML 파서 모듈 및 샘플 데이터 연동 |
| Step 4 | 서비스/네트워크/볼륨 커스텀 노드 컴포넌트 |
| Step 5 | 네트워크/볼륨/의존성 커스텀 엣지 컴포넌트 |
| Step 6 | 서비스/네트워크/볼륨 편집 사이드패널 및 useCompose 훅 |
| Step 7 | 네트워크/볼륨 추가 및 스마트 엣지 자동 연결 |
| Step 8 | YAML 생성 모듈 및 실시간 미리보기/편집 패널 |
| Step 9 | YAML 파일 임포트/익스포트 및 툴바 |
| Step 10 | 다크 테마 폴리싱 및 UI/UX 개선 |
| Step 11 | GitHub Pages 배포 설정 (GitHub Actions) |
| Step 12 | README 작성 및 v0.1.0 릴리즈 |

## 📜 라이선스

MIT License © 2026 [Dev-2A](https://github.com/Dev-2A)
