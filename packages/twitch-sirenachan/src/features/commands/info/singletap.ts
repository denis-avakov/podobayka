import type { FeatureFile } from 'utils/types';

export const feature: FeatureFile = {
  triggers: {
    firstWord: ['!singletap', '!сінглтап']
  },
  onMessage: (userName) =>
    `${userName} я новенька в грі, знаю, що потрібно використовувати більше пальців, але мені зручніше сінглтапати. Я намагаюсь навчитись, але поки погано виходить SadgeCry`
};
