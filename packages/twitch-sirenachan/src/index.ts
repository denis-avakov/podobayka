import dotenv from 'dotenv';
import cron from 'node-cron';

import auth from 'auth';
import directoryLoader from 'utils/directoryLoader';
import saveUser from 'utils/saveUser';

dotenv.config();

async function main() {
  const sirenachanBot = await auth();
  await sirenachanBot.connect();

  const commands = await directoryLoader('./src/commands/**/*.ts');
  console.log('Loading commands...');

  const timers = await directoryLoader('./src/timers/**/*.ts');
  console.log('Loading timers...');

  sirenachanBot.onJoin((channel) => {
    console.log('🔥');
  });

  sirenachanBot.onMessage((channel, user, userMessage) => {
    const userMessageText = userMessage.toLocaleLowerCase().trim();

    for (const command of commands) {
      if (command.triggers.includes(userMessageText)) {
        const response = command.run(user, userMessage);
        sirenachanBot.say(channel, response);
        return;
      }
    }

    saveUser(user);
  });

  let currentTimer = 0;
  cron.schedule('*/5 * * * *', () => {
    currentTimer = (currentTimer + 1) % timers.length;
    const response = timers[currentTimer].run();
    sirenachanBot.say('sirena_chan', response);
  });

  const giftCounts = new Map<string | undefined, number>();

  sirenachanBot.onSub((channel, user) => {
    const message = `@${user}, дякую, дуже дякую за підписку 💜`;
    sirenachanBot.say(channel, message);
  });

  sirenachanBot.onResub((channel, user, subInfo) => {
    const message = `@${user}, дякую за підписку на канал впродовж ${subInfo.months} місяців. Ти топ! 💜`;
    sirenachanBot.say(channel, message);
  });

  /*
  sirenachanBot.onSubGift((channel, recipient, subInfo) => {
    const user = subInfo.gifter;
    const previousGiftCount = giftCounts.get(user) ?? 0;

    if (previousGiftCount > 0) {
      giftCounts.set(user, previousGiftCount - 1);
    } else {
      sirenachanBot.say(channel, `Thanks ${user} for gifting a sub to ${recipient}!`);
    }
  });
*/

  sirenachanBot.onCommunitySub((channel, user, subInfo) => {
    const previousGiftCount = giftCounts.get(user) ?? 0;
    const message = `Ував увавчики, дякую ${user} за ${subInfo.count} подарованих підписок. Цьом в носик 💜`;

    giftCounts.set(user, previousGiftCount + subInfo.count);
    sirenachanBot.say(channel, message);
  });
}

main();
