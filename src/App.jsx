import Header from "./components/Header";
import EditorCanvas from "./components/EditorCanvas";
import SidePanel from "./components/panels/SidePanel";
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
    deleteNode,
    updateNodeData,
  } = useCompose();

  return (
    <div className="h-screen flex flex-col bg-slate-950">
      <Header onAddService={addService} />
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
        <SidePanel
          node={selectedNode}
          onUpdate={updateNodeData}
          onDelete={deleteNode}
          onClose={onPaneClick}
        />
      </div>
    </div>
  );
}
