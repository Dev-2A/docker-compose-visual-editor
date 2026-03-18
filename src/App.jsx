import Header from "./components/Header";
import EditorCanvas from "./components/EditorCanvas";

export default function App() {
  return (
    <div className="h-screen flex flex-col bg-slate-950">
      <Header />
      <div className="flex-1">
        <EditorCanvas />
      </div>
    </div>
  );
}
