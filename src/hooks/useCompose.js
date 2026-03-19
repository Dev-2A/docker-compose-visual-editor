import { useCallback, useMemo, useState } from "react";
import { useNodesState, useEdgesState } from "reactflow";
import { parseComposeYaml } from "../utils/yamlParser";
import { sampleComposeYaml } from "../data/sampleCompose";

let nodeIdCounter = 100;

export default function useCompose() {
  const parsed = useMemo(() => {
    try {
      return parseComposeYaml(sampleComposeYaml);
    } catch (err) {
      console.error("YAML 파싱 오류:", err);
      return { nodes: [], edges: [] };
    }
  }, []);

  const [nodes, setNodes, onNodesChange] = useNodesState(parsed.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(parsed.edges);
  const [selectedNode, setSelectedNode] = useState(null);

  // 노드 클릭
  const onNodeClick = useCallback((_event, node) => {
    setSelectedNode(node);
  }, []);

  // 캔버스 빈 공간 클릭
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // 노드 타입 판별 헬퍼
  const getNodeType = useCallback((nodeId) => {
    if (nodeId.startsWith("service-")) return "service";
    if (nodeId.startsWith("network-")) return "network";
    if (nodeId.startsWith("volume-")) return "volume";
    return "unknown";
  }, []);

  // 스마트 엣지 연결: 소스/타겟 노드 타입에 따라 엣지 타입 자동 결정
  const onConnect = useCallback(
    (params) => {
      const sourceType = getNodeType(params.source);
      const targetType = getNodeType(params.target);

      let edgeType = "dependsEdge";
      let edgeData = { type: "depends_on", name: "" };

      // 서비스 → 네트워크 또는 네트워크 → 서비스
      if (
        (sourceType === "service" && targetType === "network") ||
        (sourceType === "network" && targetType === "service")
      ) {
        const netId = sourceType === "network" ? params.source : params.target;
        const netName = netId.replace("network-", "");
        edgeType = "networkEdge";
        edgeData = { type: "network", name: netName };
      }

      // 서비스 → 볼륨 또는 볼륨 → 서비스
      if (
        (sourceType === "service" && targetType === "volume") ||
        (sourceType === "volume" && targetType === "service")
      ) {
        const volId = sourceType === "volume" ? params.source : params.target;
        const volName = volId.replace("volume-", "");
        edgeType = "volumeEdge";
        edgeData = { type: "volume", name: volName, mount: "" };
      }

      // 서비스 → 서비스
      if (sourceType === "service" && targetType === "service") {
        const depName = params.target.replace("service-", "");
        edgeData = { type: "depends_on", name: depName };
      }

      // 중복 엣지 방지
      const edgeId = `e-${params.source}-${params.target}`;
      setEdges((eds) => {
        if (eds.find((e) => e.id === edgeId)) return eds;
        return [
          ...eds,
          {
            id: edgeId,
            source: params.source,
            target: params.target,
            type: edgeType,
            data: edgeData,
          },
        ];
      });
    },
    [setEdges, getNodeType],
  );

  // 서비스 추가
  const addService = useCallback(
    (name) => {
      if (!name) {
        nodeIdCounter += 1;
        name = `service-${nodeIdCounter}`;
      }
      const id = `service-${name}`;
      const newNode = {
        id,
        type: "serviceNode",
        position: {
          x: 200 + Math.random() * 200,
          y: 100 + Math.random() * 200,
        },
        data: {
          name,
          image: "",
          build: null,
          ports: [],
          environment: [],
          depends_on: [],
          networks: [],
          volumes: [],
          command: "",
          restart: "",
          _raw: {},
        },
      };
      setNodes((nds) => [...nds, newNode]);
      setSelectedNode(newNode);
    },
    [setNodes],
  );

  // 네트워크 추가
  const addNetwork = useCallback(
    (name) => {
      if (!name) {
        nodeIdCounter += 1;
        name = `network-${nodeIdCounter}`;
      }
      const id = `network-${name}`;

      // 중복 체크
      setNodes((nds) => {
        if (nds.find((n) => n.id === id)) {
          alert(`네트워크 "${name}"이 이미 존재합니다.`);
          return nds;
        }

        const newNode = {
          id,
          type: "networkNode",
          position: {
            x: 150 + Math.random() * 300,
            y: 450 + Math.random() * 100,
          },
          data: {
            name,
            driver: "bridge",
            external: false,
            _raw: {},
          },
        };
        setSelectedNode(newNode);
        return [...nds, newNode];
      });
    },
    [setNodes],
  );

  // 볼륨 추가
  const addVolume = useCallback(
    (name) => {
      if (!name) {
        nodeIdCounter += 1;
        name = `volume-${nodeIdCounter}`;
      }
      const id = `volume-${name}`;

      setNodes((nds) => {
        if (nds.find((n) => n.id === id)) {
          alert(`볼륨 "${name}"이 이미 존재합니다.`);
          return nds;
        }

        const newNode = {
          id,
          type: "volumeNode",
          position: {
            x: 150 + Math.random() * 300,
            y: 650 + Math.random() * 100,
          },
          data: {
            name,
            driver: "local",
            external: false,
            _raw: {},
          },
        };
        setSelectedNode(newNode);
        return [...nds, newNode];
      });
    },
    [setNodes],
  );

  // 노드 삭제
  const deleteNode = useCallback(
    (nodeId) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId),
      );
      setSelectedNode(null);
    },
    [setNodes, setEdges],
  );

  // 노드 데이터 업데이트
  const updateNodeData = useCallback(
    (nodeId, newData) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id !== nodeId) return n;
          const updated = { ...n, data: { ...n.data, ...newData } };

          if (newData.name && n.data.name !== newData.name) {
            const oldId = n.id;
            const prefix = n.type.replace("Node", "");
            const newId = `${prefix}-${newData.name}`;
            updated.id = newId;

            setEdges((eds) =>
              eds.map((e) => ({
                ...e,
                source: e.source === oldId ? newId : e.source,
                target: e.target === oldId ? newId : e.target,
              })),
            );

            setSelectedNode({ ...updated });
          }

          return updated;
        }),
      );
    },
    [setNodes, setEdges],
  );

  // 엣지 삭제
  const deleteEdge = useCallback(
    (edgeId) => {
      setEdges((eds) => eds.filter((e) => e.id !== edgeId));
    },
    [setEdges],
  );

  // YAML에서 전체 로드
  const loadFromYaml = useCallback(
    (yamlString) => {
      try {
        const result = parseComposeYaml(yamlString);
        setNodes(result.nodes);
        setEdges(result.edges);
        setSelectedNode(null);
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },
    [setNodes, setEdges],
  );

  return {
    nodes,
    edges,
    selectedNode,
    onNodesChange,
    onEdgesChange,
    onNodeClick,
    onPaneClick,
    onConnect,
    addService,
    addNetwork,
    addVolume,
    deleteNode,
    deleteEdge,
    updateNodeData,
    loadFromYaml,
  };
}
