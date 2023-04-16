import pickRandom from 'utils/pickRandom';
import type { FeatureFile } from 'utils/types';

export const feature: FeatureFile = {
  triggers: {
    firstWord: ['!ball']
  },
  onMessage: () => {
    return pickRandom([
      'Моя відповідь — ТЯ! AlienPls3',
      'Мої чіпочакри вагаються. Спобуйте пізніше BRUHMM',
      'Ніт MyHonestReaction',
      'Так, неодмінно! pEEEsda',
      'Ні. Нуль допомоги, крч NOPERS',
      'Так, чуваче, це соляра! British'
    ]);
  }
};
