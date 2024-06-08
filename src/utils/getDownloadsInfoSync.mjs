import fs from 'node:fs';

const generatedFilePath = 'src/utils/downloadsInfo.json';

let downloadInfo;

try {
  downloadInfo = JSON.parse(fs.readFileSync(generatedFilePath, 'utf8'));
} catch {
  downloadInfo = { devBuild: [], releases: [] };
}

const { devBuild, releases } = downloadInfo;

export { devBuild, releases };
