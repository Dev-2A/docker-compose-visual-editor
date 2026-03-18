/**
 * 브라우저 콘솔 또는 Node.js에서 실행 가능한 간단한 검증 스크립트.
 * 실제 테스트 프레임워크는 사용하지 않음.
 */
import { parseComposeYaml } from "./yamlParser.js";
import { sampleComposeYaml } from "../data/sampleCompose.js";

const result = parseComposeYaml(sampleComposeYaml);

console.log("=== 파싱 결과 ===");
console.log(`노드 수: ${result.nodes.length}`);
console.log(`엣지 수: ${result.edges.length}`);
console.log("");

console.log("--- 노드 목록 ---");
result.nodes.forEach((n) => {
  console.log(`  [${n.type}] ${n.id} → ${n.data.name}`);
});

console.log("");
console.log("--- 엣지 목록 ---");
result.edges.forEach((e) => {
  console.log(`  [${e.type}] ${e.source} → ${e.target} (${e.data.name})`);
});
