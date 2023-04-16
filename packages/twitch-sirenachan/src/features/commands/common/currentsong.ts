import type { FeatureFile } from 'utils/types';

export const feature: FeatureFile = {
  triggers: {
    firstWord: ['!playlist', '!плейлист']
  },
  onMessage: (userName) => {
    return `${userName}, плейлист для поважних соулс плеєрів: https://open.spotify.com/playlist/66tDRCZOqph0T7pHC6fuGO kirbyVibe плейлист української музики: https://open.spotify.com/playlist/3tq9T5P47gPwxQ7nzq6uiI kirbyVibe ЗАЦІНИ, ЙОМАЙО pEEEsda`;
  }
};
