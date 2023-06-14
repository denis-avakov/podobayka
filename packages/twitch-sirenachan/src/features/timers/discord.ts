import type { FeatureFile } from 'utils/types';
import pickRandom from 'utils/pickRandom';

export const feature: FeatureFile = {
  onTimer: () => {
    return pickRandom([
      'LUBBERS Сповіщення про трансляції, мемчики, хіханьки-хаханьки, музичка, картиночки, приємне та коммюніті, спілкування на будь-яку тему та багато іншого тут: https://discord.gg/anerisun LUBBERS',
      'monkaThink Долучайся, можливо, саме сьогодні тобі випаде нагода побачити ніжчки модера у панчохах або послухати його увукання у войсику https://discord.gg/anerisun monkaThink'
    ]);
  }
};
