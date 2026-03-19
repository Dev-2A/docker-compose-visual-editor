import { useState } from "react";
import Header from "./components/Header";
import EditorCanvas from "./components/EditorCanvas";
import SidePanel from "./components/panels/SidePanel";
import YamlPreview from "./components/panels/YamlPreview";
import useCompose from "./hooks/useCompose";

export default function App() {
  const {
    nodes,
    edges,
    selectedNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onPaneClick,
    addService,
    addNetwork,
    addVolume,
    deleteNode,
    updateNodeData,
    loadFromYaml,
  } = useCompose();

  const [yamlOpen, setYamlOpen] = useState(false);

  const handleToggleYaml = () => {
    setYamlOpen((prev) => !prev);
  };

  return (
    <div className="h-screen flex flex-col bg-slate-950">
      <Header
        onAddService={addService}
        onAddNetwork={addNetwork}
        onAddVolume={addVolume}
        yamlOpen={yamlOpen}
        onToggleYaml={handleToggleYaml}
      />
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1">
          <EditorCanvas
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
          />
        </div>

        {/* 사이드패널: YAML 프리뷰가 열리면 편집 패널은 닫힘 */}
        {yamlOpen ? (
          <YamlPreview
            nodes={nodes}
            edges={edges}
            onClose={() => setYamlOpen(false)}
            onLoad={loadFromYaml}
          />
        ) : (
          <SidePanel
            node={selectedNode}
            onUpdate={updateNodeData}
            onDelete={deleteNode}
            onClose={onPaneClick}
          />
        )}
      </div>
    </div>
  );
}
