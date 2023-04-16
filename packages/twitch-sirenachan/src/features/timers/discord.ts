import type { FeatureFile } from 'utils/types';
import pickRandom from 'utils/pickRandom';

export const feature: FeatureFile = {
  onTimer: () => {
    return pickRandom([
      '/announce LUBBERS Сповіщення про трансляції, мемчики, хіханьки-хаханьки, музичка, картиночки, приємне та коммюніті, спілкування на будь-яку тему та багато іншого тут: https://discord.gg/sirenachan LUBBERS',
      '/announce monkaThink Долучайся, можливо, саме сьогодні тобі випаде нагода побачити ніжчки модера у панчохах або послухати його увукання у войсику https://discord.gg/sirenachan monkaThink'
    ]);
  }
};
