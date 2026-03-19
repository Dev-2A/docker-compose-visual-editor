import ServicePanel from "./ServicePanel";
import NetworkPanel from "./NetworkPanel";
import VolumePanel from "./VolumePanel";

export default function SidePanel({ node, onUpdate, onDelete, onClose }) {
  if (!node) return null;

  const panelMap = {
    serviceNode: ServicePanel,
    networkNode: NetworkPanel,
    volumeNode: VolumePanel,
  };

  const Panel = panelMap[node.type];
  if (!Panel) return null;

  return (
    <div className="panel-slide-in">
      <Panel
        node={node}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onClose={onClose}
      />
    </div>
  );
}
