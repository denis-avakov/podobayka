import type { FeatureFile } from 'utils/types';

export const feature: FeatureFile = {
  triggers: {
    firstWord: ['!playlist']
  },
  onMessage: (userName) => {
    return `catDisco ${userName}, туво у мене є два файних плейлиста, заціни! https://open.spotify.com/playlist/66tDRCZOqph0T7pHC6fuGO https://open.spotify.com/playlist/3tq9T5P47gPwxQ7nzq6uiI catDisco`;
    // return `catDisco ${userName}, туво є файний плейлист з українською музикою, заціни! https://open.spotify.com/playlist/3tq9T5P47gPwxQ7nzq6uiI?si=4cb345d796344a59 catDisco`;
  }
};
