import { useCallback, useMemo, useState } from "react";
import { addEdge, useNodesState, useEdgesState } from "reactflow";
import { parseComposeYaml } from "../utils/yamlParser";
import { sampleComposeYaml } from "../data/sampleCompose";

let nodeIdCounter = 100;
function getNextId(prefix) {
  nodeIdCounter += 1;
  return `${prefix}-$[nodeIdCounter]`;
}

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

  // 캔버스 빈 공간 클릭 → 패널 닫기
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);

  // 엣지 연결
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // 서비스 추가
  const addService = useCallback(
    (name) => {
      const id = `service-${name || getNextId("svc")}`;
      const newNode = {
        id,
        type: "serviceNode",
        position: {
          x: 200 + Math.random() * 200,
          y: 100 + Math.random() * 200,
        },
        data: {
          name: name || `service-${nodeIdCounter}`,
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

          // 이름이 바뀌었으면 id도 갱신 + 관련 엣지도 갱신
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
    onNodeClick,
    onPaneClick,
    onConnect,
    addService,
    deleteNode,
    updateNodeData,
    loadFromYaml,
  };
}
