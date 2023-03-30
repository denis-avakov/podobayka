import chatterList from 'cache/chatterList';
import type { FeatureFile } from 'utils/types';

export const feature: FeatureFile = {
  triggers: {
    firstWord: ['!nice']
  },
  onMessage: (currentUserName) => {
    const randomUserName = chatterList.getRandomUserName();

    if (!randomUserName || currentUserName === randomUserName) {
      return 'Найс ЧСВ peepoFat';
    }

    return `APPLE Біжу повідоміти чатику, що ${randomUserName} найс! APPLE`;
  }
};
