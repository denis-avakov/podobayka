import moderatorList from 'cache/moderatorList';
import type { FeatureFile } from 'utils/types';

export const feature: FeatureFile = {
  triggers: {
    firstWord: ['!instagram', '!inst', '!ig']
  },
  onMessage: (userName) => {
    if (moderatorList.getList().includes(userName)) {
      return '/announce https://www.instagram.com/sirenachan';
    }

    return `${userName} https://www.instagram.com/sirenachan`;
  }
};
