import getRandomUser from 'utils/getRandomUser';

export default {
  triggers: ['!nice'],
  run: (user: string, message?: string) => {
    const randomUser = getRandomUser();

    if (user.toLowerCase() === randomUser.toLowerCase()) {
      return 'Найс ЧСВ peepoFat';
    }

    return `APPLE Біжу повідоміти чатику, що ${randomUser} найс! APPLE`;
  }
};
