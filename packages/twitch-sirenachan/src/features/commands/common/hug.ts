import { random } from 'lodash';
import chatterList from 'cache/chatterList';
import pickRandom from 'utils/pickRandom';
import type { FeatureFile } from 'utils/types';

export const feature: FeatureFile = {
  triggers: {
    firstWord: ['!hug', '!обняти']
  },
  onMessage: (currentUserName) => {
    const randomUserName = chatterList.getRandomUserName();

    if (!randomUserName || currentUserName === randomUserName) {
      return pickRandom([
        `Сам себе не обіймеш — ніхто не обійме. Ану іди сюдиии LUBBERS`,
        `Чуєш, штемп, шо по ЧСВ? BRUHMM`
      ]);
    }

    const randomHugsNum = random(1, 100);
    return `${currentUserName} робить ${randomHugsNum} обіймашок ${randomUserName}! frenn`;
  }
};
