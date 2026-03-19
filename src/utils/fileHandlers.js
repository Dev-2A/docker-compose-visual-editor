/**
 * .yml 파일을 읽어서 문자열로 반환한다.
 * @param {File} file
 * @returns {Promise<string>}
 */
export function readYamlFile(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("파일이 선택되지 않았습니다."));
      return;
    }

    const validExts = [".yml", ".yaml"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!validExts.includes(ext)) {
      reject(
        new Error(
          `지원하지 않는 파일 형식입니다: ${ext}\n.yml 또는 .yaml 파일만 가능합니다.`,
        ),
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = () => reject(new Error("파일 읽기에 실패했습니다."));
    reader.readAsText(file);
  });
}

/**
 * 문자열을 .yml 파일로 다운로드한다.
 * @param {string} content
 * @param {string} filename
 */
export function downloadYamlFile(content, filename = "docker-compose.yml") {
  const blob = new Blob([content], { type: "text/yaml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
