import type { FeatureFile } from 'utils/types';
import pickRandom from 'utils/pickRandom';

export const feature: FeatureFile = {
  onTimer: () => {
    return pickRandom([
      'Підписка — один з найкращих шляхів підтримати канал. Оформивши підписку, ви зможете отримати доступ до емоутів, переглядати стрім без реклами, матимете спеціальну роль у дискорді та безмежну подяку стрімера! aneris2Love aneris2Love aneris2Love',
      'Оформляй підписку, тоді виросте піська! aneris2Knife А ще стануть доступними емоути каналу:   aneris2Ache aneris2CatDance aneris2Chinchopa aneris2Comfy aneris2Cry aneris2Dance aneris2Heart aneris2Hi aneris2Jail aneris2Knife aneris2Lol aneris2Love aneris2Lurk aneris2Luvki aneris2Raid aneris2Sit aneris2Uwu aneris2Yay aneris2Yomayo'
    ]);
  }
};
