import { random } from 'lodash';
import pickRandom from 'utils/pickRandom';
import type { FeatureFile } from 'utils/types';

export const feature: FeatureFile = {
  triggers: {
    firstWord: ['!bibi', '!бібі']
  },
  onMessage: (userName) => {
    const bibaLength = random(0, 36);

    if (0 === bibaLength) {
      return pickRandom([
        `${userName}, песюн 0 (НУЛЬ) см. Brooooo`,
        `${userName}, у тебе немає песюна! catOK`
      ]);
    }

    if (10 >= bibaLength) {
      return pickRandom([
        `Ого, у ${userName} гвинтик ${bibaLength} см MyHonestReaction`,
        `${userName} бібібі ${bibaLength} см maaaaan`
      ]);
    }

    if (16 >= bibaLength) {
      return pickRandom([
        `${userName}, твій містер бібі ${bibaLength} см Binoculous`,
        `У ${userName} бебрик ${bibaLength} см. Ммм, а пахне як! OkayChamp`
      ]);
    }

    if (25 >= bibaLength) {
      return pickRandom([
        `Хіхі, а ${userName} має бібу ${bibaLength} см STAREBUTINLOVE`,
        `Ого, ого у ${userName} ${bibaLength} см. Моя повага frenn`
      ]);
    }

    return pickRandom([
      `УВАГА! ${userName} має ${bibaLength} см. Ти шо, бібозавр? SUSSY`,
      `АШАЛЄТЬ ${userName} твій бабрище аж ${bibaLength} см! ReallyMad`
    ]);
  }
};
