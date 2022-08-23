import chatterList from 'cache/chatterList';

export default {
  triggers: ['!nice'],
  run: (currentUser: string) => {
    const randomUserName = chatterList.getRandomUserName();

    if (!randomUserName || currentUser === randomUserName) {
      return 'Найс ЧСВ peepoFat';
    }

    return `APPLE Біжу повідоміти чатику, що @${randomUserName} найс! APPLE`;
  }
};
