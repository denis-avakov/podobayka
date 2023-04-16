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
        '/announce Долучайтесь до тг-каналу з мемчиками, фоточками та сповіщеннями про стрім AlienPls3 https://t.me/sirenachan AlienPls3'
      ]);
    }

    return `${userName} https://t.me/sirenachan`;
  }
};
