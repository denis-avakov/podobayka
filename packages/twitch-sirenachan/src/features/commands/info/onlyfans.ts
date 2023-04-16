import type { FeatureFile } from 'utils/types';

export const feature: FeatureFile = {
  triggers: {
    firstWord: ['!оф', '!of', '!onlyfans', '!онліфанс']
  },
  onMessage: (userName) =>
    `${userName} https://bit.ly/3GJh9Jl xdding`
};
