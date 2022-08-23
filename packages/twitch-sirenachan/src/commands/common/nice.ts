import chatter from 'cache/chatter';

export default {
  triggers: ['!nice'],
  run: (currentUser: string) => {
    const randomUserName = chatter.getRandomUserName();

    if (!randomUserName || currentUser === randomUserName) {
      return 'Найс ЧСВ peepoFat';
    }

    return `APPLE Біжу повідоміти чатику, що @${randomUserName} найс! APPLE`;
  }
};
