import { random, sample } from 'lodash';

export default {
  triggers: ['!bibi', '!бібі'],
  run: (user: string, message?: string) => {
    const bibaLength = random(0, 36);

    if (0 === bibaLength) {
      return sample([
        `0 (НУЛЬ) см. ${user}, чел, скажи паляниця Kappa`,
        `${user}, у тебе немає песюна! Hahaa`
      ]);
    }

    if (10 >= bibaLength) {
      return sample([
        `Ого, у ${user} гвинтик ${bibaLength} см FeelsGoodEnoughMan`,
        `${user} бібібі ${bibaLength} см Smoge`
      ]);
    }

    if (16 >= bibaLength) {
      return sample([
        `${user}, твій містер бібі ${bibaLength} см roflanEbalo`,
        `У ${user} бебрик ${bibaLength} см. Ммм а пахне як! peepoSwing`
      ]);
    }

    if (25 >= bibaLength) {
      return sample([
        `Хіхі, а ${user} має бібу ${bibaLength} см catFlustered`,
        `Ого, ого у ${user} ${bibaLength} см. Моя повага LickMe`
      ]);
    }

    return sample([
      `УВАГА! ${user} має ${bibaLength} см. Ти шо, бібозавр? Pogey`,
      `${user} твій бабрище аж ${bibaLength} см! monkaChrist`
    ]);
  }
};
