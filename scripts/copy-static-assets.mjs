import { cpSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const outputDirectory = resolve(projectRoot, 'dist');

for (const directory of ['audio', 'images']) {
  const source = resolve(projectRoot, directory);

  if (!existsSync(source)) {
    throw new Error(`Required static asset directory not found: ${source}`);
  }

  cpSync(source, resolve(outputDirectory, directory), { recursive: true });
}
