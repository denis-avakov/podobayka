import { random } from 'lodash';

export default function createRubbishText(min: number, max: number, value: string) {
  return Array.from({ length: random(min, max) }, () => value).join(' ');
}
