import chatterList from 'cache/chatterList';
import type { FeatureFile } from 'utils/types';

export const feature: FeatureFile = {
  triggers: {
    firstWord: ['!nice',  '!найс']
  },
  onMessage: (currentUserName) => {
    const randomUserName = chatterList.getRandomUserName();

    if (!randomUserName || currentUserName === randomUserName) {
      return 'Найс ЧСВ pEEEsda';
    }

    return `kirbyVibe ${randomUserName} НАЙС, ВСІ ЗНАЙТЕ kirbyVibe `;
  }
};
