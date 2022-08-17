import chatter from 'api/chatter';

export default {
  triggers: ['!nice'],
  run: async (user: string) => {
    const randomChatter = await chatter.pickRandom();

    if (user.toLowerCase() === randomChatter.userName) {
      return 'Найс ЧСВ peepoFat';
    }

    return `APPLE Біжу повідоміти чатику, що ${randomChatter.userName} найс! APPLE`;
  }
};
