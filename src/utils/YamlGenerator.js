import yaml from "js-yaml";

/**
 * ReactFlow의 nodes / edges 배열을 받아
 * docker-compose.yml 문자열로 변환한다.
 */
export function generateComposeYaml(nodes, edges) {
  const doc = {};

  // 노드를 타입별로 분류
  const serviceNodes = nodes.filter((n) => n.type === "serviceNode");
  const networkNodes = nodes.filter((n) => n.type === "networkNode");
  const volumeNodes = nodes.filter((n) => n.type === "volumeNode");

  // 엣지를 타입별로 분류
  const networkEdges = edges.filter((e) => e.type === "networkEdge");
  const volumeEdges = edges.filter((e) => e.type === "volumeEdge");
  const dependsEdges = edges.filter((e) => e.type === "dependsEdge");

  // --- services ---
  if (serviceNodes.length > 0) {
    const services = {};

    serviceNodes.forEach((node) => {
      const d = node.data;
      const svc = {};

      // image 또는 build
      if (d.image) {
        svc.image = d.image;
      }
      if (d.build) {
        svc.build = typeof d.build === "string" ? d.build : d.build;
      }

      //command
      if (d.command) {
        svc.command = d.command;
      }

      // ports
      if (d.ports && d.ports.length > 0) {
        svc.ports = [...d.ports];
      }

      //environment
      if (d.environment) {
        const envArr = Array.isArray(d.environment)
          ? d.environment
          : typeof d.environment === "object"
            ? Object.entries(d.environment).map(([k, v]) => `${k}=${v}`)
            : [];
        if (envArr.length > 0) {
          svc.environment = envArr;
        }
      }

      //depends_on: 엣지에서 추출
      const deps = dependsEdges
        .filter((e) => e.source === node.id)
        .map((e) => {
          const targetNode = serviceNodes.find((n) => n.id === e.target);
          return targetNode
            ? targetNode.data.name
            : e.target.replace("service-", "");
        });
      if (deps.length > 0) {
        svc.depends_on = deps;
      }

      // networks: 엣지에서 추출
      const nets = networkEdges
        .filter((e) => e.source === node.id || e.target === node.id)
        .map((e) => {
          // 상대편이 네트워크 노드
          const netNodeId = e.source === node.id ? e.target : e.source;
          const netNode = networkNodes.find((n) => n.id === netNodeId);
          return netNode ? netNode.data.name : e.data?.name || "";
        })
        .filter(Boolean);
      if (nets.length > 0) {
        svc.networks = [...new Set(nets)]; // 중복 제거
      }

      // volumes: 엣지에서 추출 + 바인드 마운트를 _raw에서 복원
      const namedVols = volumeEdges
        .filter((e) => e.source === node.id || e.target === node.id)
        .map((e) => {
          const volNodeId = e.source === node.id ? e.target : e.source;
          const volNode = volumeNodes.find((n) => n.id === volNodeId);
          const volName = volNode ? volNode.data.name : e.data?.name || "";
          const mount = e.data?.mount || "";
          return mount ? `${volName}:${mount}` : volName;
        })
        .filter(Boolean);

      // _raw에서 바인드 마운트(./로 시작하는 것) 복원
      const rawVolumes = d._raw?.volumes || d.volumes || [];
      const bindMounts = rawVolumes.filter((v) => {
        const str = typeof v === "string" ? v : v.source || "";
        return str.startsWith(".") || str.startsWith("/");
      });

      const allVolumes = [...bindMounts, ...namedVols];
      if (allVolumes.length > 0) {
        svc.volumes = allVolumes;
      }

      // restart
      if (d.restart) {
        svc.restart = d.restart;
      }

      services[d.name] = svc;
    });

    doc.services = services;
  }

  // --- networks ---
  if (networkNodes.length > 0) {
    const networks = {};
    networkNodes.forEach((node) => {
      const d = node.data;
      const net = {};
      if (d.driver && d.driver !== "bridge") {
        net.driver = d.driver;
      }
      if (d.external) {
        net.external = true;
      }
      networks[d.name] = Object.keys(net).length > 0 ? net : null;
    });
    doc.networks = networks;
  }

  // --- volumes ---
  if (volumeNodes.length > 0) {
    const volumes = {};
    volumeNodes.forEach((node) => {
      const d = node.data;
      const vol = {};
      if (d.driver && d.driver !== "local") {
        vol.driver = d.driver;
      }
      if (d.external) {
        vol.external = true;
      }
      volumes[d.name] = Object.keys(vol).length > 0 ? vol : null;
    });
    doc.volumes = volumes;
  }

  // YAML 문자열 생성
  return yaml.dump(doc, {
    indent: 2,
    lineWidth: -1, // 줄바꿈 안 함
    noRefs: true, // 앵커/별칭 사용 안 함
    quotingType: '"',
    forceQuotes: false,
    sortKeys: false,
  });
}
