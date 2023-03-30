import { random } from 'lodash';
import chatterList from 'cache/chatterList';
import pickRandom from 'utils/pickRandom';
import type { FeatureFile } from 'utils/types';

export const feature: FeatureFile = {
  triggers: {
    firstWord: ['!hug']
  },
  onMessage: (currentUserName) => {
    const randomUserName = chatterList.getRandomUserName();

    if (!randomUserName || currentUserName === randomUserName) {
      return pickRandom([
        `Сам себе не обіймеш — ніхто не обійме. Ану іди сюдиии catBlush `,
        `Чіл, а чому рот в ЧСВ? peepoFat`
      ]);
    }

    const randomHugsNum = random(1, 100);
    return `BearHug ${currentUserName} робить ${randomHugsNum} обіймашок ${randomUserName}! BearHug`;
  }
};
