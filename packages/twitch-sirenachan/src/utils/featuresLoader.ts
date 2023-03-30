import glob from 'tiny-glob';
import { FeatureFile } from 'utils/types';

export default async function featuresLoader(target: string) {
  const paths = await glob(target, { absolute: true });
  return paths.map((filePath) => require(filePath).feature as FeatureFile);
}
