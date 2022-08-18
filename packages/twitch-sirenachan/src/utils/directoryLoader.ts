import glob from 'tiny-glob';

export default async function directoryLoader(target: string) {
  const paths = await glob(target, { absolute: true });
  const packages = [];

  for (const path of paths) {
    packages.push(require(path).default);
  }

  return packages;
}
