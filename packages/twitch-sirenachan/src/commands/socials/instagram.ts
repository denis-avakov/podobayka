import moderatorList from 'cache/moderatorList';

export default {
  triggers: ['!instagram', '!inst', '!ig'],
  run: (user: string) => {
    if (moderatorList.getList().includes(user)) {
      return '/announce https://www.instagram.com/sirenachan';
    }

    return `${user} https://www.instagram.com/sirenachan`;
  }
};
