import fs from 'fs';
import path from 'path';

export default async function directoryLoader(target: string) {
  const packages = [];

  const packageFiles = fs
    // Look for files as TS (dev) or JS (built files)
    .readdirSync(path.resolve(__dirname, target))
    .filter((file) => file.endsWith('.ts') || file.endsWith('.js'));

  for (const packageFile of packageFiles) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const feature = require(`${target}/${packageFile}`);
    packages.push({ ...feature });
  }

  return packages;
}
