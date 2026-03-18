import yaml from "js-yaml";

/**
 * docker-compose.yml 문자열을 파싱하여
 * ReactFlow용 nodes/edges 배열로 변환한다.
 */
export function parseComposeYaml(yamlString) {
  const doc = yaml.load(yamlString);

  if (!doc || !doc.services) {
    throw new Error(
      "유효한 docker-compose.yml이 아닙니다. services 키가 필요합니다.",
    );
  }

  const nodes = [];
  const edges = [];

  const services = doc.services || {};
  const networks = doc.networks || {};
  const volumes = doc.volumes || {};

  // 서비스 노드 생성
  const serviceNames = Object.keys(services);
  serviceNames.forEach((name, index) => {
    const service = services[name];
    const col = index % 3;
    const row = Math.floor(index / 3);

    nodes.push({
      id: `service-${name}`,
      type: "serviceNode",
      position: { x: 100 + col * 300, y: 100 + row * 250 },
      data: {
        name,
        image: service.image || "",
        build: service.build || null,
        ports: service.ports || [],
        environment: service.environment || [],
        depends_on: service.depends_on || [],
        networks: service.networks || [],
        volumes: service.volumes || [],
        command: service.command || "",
        restart: service.restart || "",
        _raw: service,
      },
    });
  });

  // 네트워크 노드 생성
  const networkNames = Object.keys(networks);
  networkNames.forEach((name, index) => {
    const network = networks[name] || {};

    nodes.push({
      id: `network-${name}`,
      type: "networkNode",
      position: { x: 100 + index * 250, y: 500 },
      data: {
        name,
        driver: network.driver || "bridge",
        external: network.external || false,
        _raw: network,
      },
    });
  });

  // 볼륨 노드 생성
  const volumeNames = Object.keys(volumes);
  volumeNames.forEach((name, index) => {
    const volume = volumes[name] || {};

    nodes.push({
      id: `volume-${name}`,
      type: "volumeNode",
      position: { x: 100 + index * 250, y: 700 },
      data: {
        name,
        driver: volume.driver || "local",
        external: volume.external || false,
        _raw: volume,
      },
    });
  });

  // 엣지 생성: 서비스 → 네트워크
  serviceNames.forEach((svcName) => {
    const service = services[svcName];
    const svcNetworks = service.networks || [];

    // networks가 배열일 수도, 객체일 수도 있음
    const netList = Array.isArray(svcNetworks)
      ? svcNetworks
      : Object.keys(svcNetworks);

    netList.forEach((netName) => {
      // 네트워크가 top-level에 정의돼 있든 아니든 엣지 생성
      edges.push({
        id: `e-${svcName}-net-${netName}`,
        source: `service-${svcName}`,
        target: `network-${netName}`,
        type: "networkEdge",
        data: { type: "network", name: netName },
      });

      // top-level에 없는 네트워크면 노드도 자동 생성
      if (
        !networks[netName] &&
        !nodes.find((n) => n.id === `network-${netName}`)
      ) {
        nodes.push({
          id: `network-${netName}`,
          type: "networkNode",
          position: { x: 100 + nodes.length * 120, y: 500 },
          data: { name: netName, drier: "bridge", external: false, _raw: {} },
        });
      }
    });
  });

  // 엣지 생성: 서비스 → 볼륨 (named volume만)
  serviceNames.forEach((svcName) => {
    const service = services[svcName];
    const svcVolumes = service.volumes || [];

    svcVolumes.forEach((vol) => {
      // "volume_name:/path" 형태만 추출 (./로 시작하는 바인드 마운트 제외)
      const volStr = typeof vol === "string" ? vol : vol.source || "";
      const parts = volStr.split(":");
      const volName = parts[0];

      if (volName && !volName.startsWith(".") && !volName.startsWith("/")) {
        edges.push({
          id: `e-${svcName}-vol-${volName}`,
          source: `service-${svcName}`,
          target: `volume-${volName}`,
          type: "volumeEdge",
          data: { type: "volume", name: volName, mount: parts[1] || "" },
        });

        // top-level에 없는 볼륨이면 노드 자동 생성
        if (
          !volumes[volName] &&
          !nodes.find((n) => n.id === `volume-${volName}`)
        ) {
          nodes.push({
            id: `volume-${volName}`,
            type: "volumeNode",
            position: { x: 100 + nodes.length * 120, y: 700 },
            data: { name: volName, driver: "local", external: false, _raw: {} },
          });
        }
      }
    });
  });

  // 엣지 생성: depends_on
  serviceNames.forEach((svcName) => {
    const service = services[svcName];
    let deps = service.depends_on || [];

    // depends_on이 객체일 수도 있음 (condition 포함)
    if (!Array.isArray(deps)) {
      deps = Object.keys(deps);
    }

    deps.forEach((depName) => {
      edges.push({
        id: `e-${svcName}-dep-${depName}`,
        source: `service-${svcName}`,
        target: `service-${depName}`,
        type: "dependsEdge",
        data: { type: "depends_on", name: depName },
      });
    });
  });

  return { nodes, edges, raw: doc };
}
