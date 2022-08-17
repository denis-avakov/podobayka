import { sample, random } from 'lodash';
import chatter from 'api/chatter';

export default {
  triggers: ['!hug'],
  run: async (user: string) => {
    const randomChatter = await chatter.pickRandom();

    if (user.toLowerCase() === randomChatter.userName) {
      return sample([
        `Сам себе не обіймеш — ніхто не обійме. Ану іди сюдиии catBlush `,
        `Чіл, а чому рот в ЧСВ? peepoFat`
      ]);
    }

    return `BearHug ${user} робить ${random(1, 100)} обіймашок ${randomChatter.userName}! BearHug`;
  }
};
