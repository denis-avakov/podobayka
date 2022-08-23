export default {
  triggers: ['!instagram', '!inst', '!ig'],
  run: (user: string) => {
    return `${user} https://www.instagram.com/sirenachan`;
  }
};
