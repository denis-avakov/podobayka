export default {
  triggers: ['!telegram', '!tg'],
  run: (user: string, message?: string) => {
    return `${user} зараз немає, але колись у майбутньому обов'язково з'явиться (інфа неточна) Kappa`;
  }
};
