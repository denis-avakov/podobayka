export default {
  triggers: ['!instagram', '!inst', '!ig'],
  run: (user: string, message?: string) => {
    return `${user} https://www.instagram.com/sirenachan`;
  }
};
