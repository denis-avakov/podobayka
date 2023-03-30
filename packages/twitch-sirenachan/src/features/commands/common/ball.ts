import pickRandom from 'utils/pickRandom';
import type { FeatureFile } from 'utils/types';

export const feature: FeatureFile = {
  triggers: {
    firstWord: ['!ball']
  },
  onMessage: () => {
    return pickRandom([
      'Моя відповідь — ТЯ! AlienPls3',
      'Мої чіпочакри вагаються. Спобуйте пізніше.',
      'Ніт SillyCat ',
      'Так, неодмінно! rainbowPls',
      'Ні. Нуль допомоги, крч monkaStop',
      'Так, чуваче, це соляра! British'
    ]);
  }
};
