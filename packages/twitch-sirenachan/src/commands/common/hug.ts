import { sample, random } from 'lodash';
import getRandomUser from 'utils/getRandomUser';

export default {
  triggers: ['!hug'],
  run: (user: string, message?: string) => {
    const randomUser = getRandomUser();

    if (user.toLowerCase() === randomUser.toLowerCase()) {
      return sample([
        `Сам себе не обіймеш — ніхто не обійме. Ану іди сюдиии catBlush `,
        `Чіл, а чому рот в ЧСВ? peepoFat`
      ]);
    }

    return `BearHug ${user} робить ${random(1, 100)} обіймашок ${randomUser}! BearHug`;
  }
};
