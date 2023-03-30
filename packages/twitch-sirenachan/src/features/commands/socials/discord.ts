import moderatorList from 'cache/moderatorList';
import pickRandom from 'utils/pickRandom';
import type { FeatureFile } from 'utils/types';

export const feature: FeatureFile = {
  triggers: {
    firstWord: ['!discord', '!ds', '!dis', '!діс']
  },
  onMessage: (userName) => {
    if (moderatorList.getList().includes(userName)) {
      return pickRandom([
        '/announce шановні чілібосіки, чіли та пчілки, заходьте, будь ласка, в діскорд https://discord.gg/FgkgzzDRWJ',
        '/announce доречі, шановні, хто не знав то там є дискорді канал, ми там хіхікаєм, і дивимось хорні перед сном, швиденько долучайтесь https://discord.gg/FgkgzzDRWJ'
      ]);
    }

    return `${userName} https://discord.gg/FgkgzzDRWJ`;
  }
};
