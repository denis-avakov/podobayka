import { sample } from 'lodash';

export default {
  triggers: ['!ball'],
  run: () => {
    return sample([
      'Моя відповідь — ТЯ! AlienPls3',
      'Мої чіпочакри вагаються. Спобуйте пізніше.',
      'Ніт SillyCat ',
      'Так, неодмінно! rainbowPls',
      'Ні. Нуль допомоги, крч monkaStop',
      'Так, чуваче, це соляра! British'
    ]);
  }
};
