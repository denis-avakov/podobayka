import type { FeatureFile } from 'utils/types';

export const feature: FeatureFile = {
  triggers: {
    firstWord: ['!osu', '!осу']
  },
  onMessage: (userName) =>
    `KirbyDance ${userName} https://osu.ppy.sh/users/7758531 почала +- активно грати в червні 2022, я новачок, не сваріться сильно. Граю з мишкою та клавіатурою, здебільшого 4-5* мапки KirbyDance`
};
