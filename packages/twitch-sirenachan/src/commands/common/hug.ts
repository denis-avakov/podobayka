import { sample, random } from 'lodash';
import chatter from 'cache/chatter';

export default {
  triggers: ['!hug'],
  run: (currentUser: string) => {
    const randomUserName = chatter.getRandomUserName();

    if (!randomUserName || currentUser === randomUserName) {
      return sample([
        `Сам себе не обіймеш — ніхто не обійме. Ану іди сюдиии catBlush `,
        `Чіл, а чому рот в ЧСВ? peepoFat`
      ]);
    }

    return `BearHug @${currentUser} робить ${random(1, 100)} обіймашок @${randomUserName}! BearHug`;
  }
};
