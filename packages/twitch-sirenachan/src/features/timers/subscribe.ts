import type { FeatureFile } from 'utils/types';
import pickRandom from 'utils/pickRandom';

export const feature: FeatureFile = {
  onTimer: () => {
    return pickRandom([
      'Підписка — один з найкращих шляхів підтримати канал. Оформивши підписку, ви зможете отримати доступ до емоутів, переглядати стрім без реклами, матимете спеціальну роль у дискорді та безмежну подяку стрімера! sirena19Heart sirena19Heart sirena19Heart',
      'Оформляй підписку, тоді виросте піська! sirena19Knife А ще стануть доступними емоути каналу:  sirena19Stare sirena19Love sirena19Popcorn sirena19Gasm sirena19Hi sirena19Angry sirena19Clown sirena19Knife sirena19Raid sirena19Cry sirena19Jail sirena19Luvki sirena19Dance sirena19Ache sirena19CatDance sirena19Heart'
    ]);
  }
};
