import { random, sample } from 'lodash';

export default {
  triggers: ['!bibi', '!бібі'],
  run: (user: string, message?: string) => {
    const bibaLength = random(0, 36);

    if (0 === bibaLength) {
      return sample([
        `${user}, песюн 0 (НУЛЬ) см. monkaW`,
        `${user}, у тебе немає песюна! pepePoint`
      ]);
    }

    if (10 >= bibaLength) {
      return sample([
        `Ого, у ${user} гвинтик ${bibaLength} см peepoGiggles`,
        `${user} бібібі ${bibaLength} см maaaaan`
      ]);
    }

    if (16 >= bibaLength) {
      return sample([
        `${user}, твій містер бібі ${bibaLength} см PepoG`,
        `У ${user} бебрик ${bibaLength} см. Ммм, а пахне як! YAPPP`
      ]);
    }

    if (25 >= bibaLength) {
      return sample([
        `Хіхі, а ${user} має бібу ${bibaLength} см Awkward`,
        `Ого, ого у ${user} ${bibaLength} см. Моя повага peepoRasp`
      ]);
    }

    return sample([
      `УВАГА! ${user} має ${bibaLength} см. Ти шо, бібозавр? Binoculous`,
      `${user} твій бабрище аж ${bibaLength} см! ReallyMad`
    ]);
  }
};
