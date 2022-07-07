import { sample } from 'lodash';

export default {
  triggers: ['!ball'],
  run: (user: string, message?: string) => {
    return sample([
      'Моя відповідь — ТЯ! peepoSwing',
      'Мої чіпочакри вагаються. Loading...',
      'Ніт RoflanPominki',
      'Чел ты... А почему рот в вопросе? roflanEbalo',
      'Так, неодмінно! LennyFace',
      'Ні. Нуль допомоги, крч peepoRun',
      'Так, чуваче, це соляра! Pogey'
    ]);
  }
};
