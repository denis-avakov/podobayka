import type { FeatureFile } from 'utils/types';
import pickRandom from 'utils/pickRandom';

export const feature: FeatureFile = {
  onTimer: () => {
    return pickRandom([
      '/announce Згідно давньої легенди, якщо зафолловити цей канал, то можна отримати подяку стрімера STAREBUTINLOVE',
      '/announce 💜 Тицяйте вподобайку, якщо сподобався стрім. Вам неважко, а стрімерці приємно! 💜'
    ]);
  }
};
