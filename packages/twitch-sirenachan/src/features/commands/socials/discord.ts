import moderatorList from 'cache/moderatorList';
import pickRandom from 'utils/pickRandom';
import type { FeatureFile } from 'utils/types';

export const feature: FeatureFile = {
  triggers: {
    firstWord: ['!discord', '!ds', '!dis', '!діс', '!дс']
  },
  onMessage: (userName) => {
    if (moderatorList.getList().includes(userName)) {
      return pickRandom([
        'Шановне паньство, долучайтесь PartyKirby https://discord.gg/anerisun PartyKirby',
        'jamm Шукаєш коммюніті, де можна поспілкуватись на будь-яку тему, надсилати мемчики та музику, дивитись гарні картиночки, знайти гравців для спільної гри та просто похіхікати перед сном? Для цього потрібно всього лиш долучитись... https://discord.gg/anerisun'
      ]);
    }

    return `${userName} https://discord.gg/anerisun`;
  }
};
