import moderatorList from 'cache/moderatorList';
import pickRandom from 'utils/pickRandom';
import type { FeatureFile } from 'utils/types';

export const feature: FeatureFile = {
  triggers: {
    firstWord: ['!telegram', '!tg']
  },
  onMessage: (userName) => {
    if (moderatorList.getList().includes(userName)) {
      return pickRandom([
        '/announce долучайтесь до телеграм каналу з шітпостами і моїми фоточками https://t.me/sirenachan'
      ]);
    }

    return `${userName} https://t.me/sirenachan`;
  }
};
