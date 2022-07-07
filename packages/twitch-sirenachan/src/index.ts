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
    for (const timer of timers) {
      cron.schedule(timer.cron, () => {
        const response = timer.run();
        sirenachanBot.say(channel, response);
      });
    }
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

  const giftCounts = new Map<string | undefined, number>();

  sirenachanBot.onSub((channel, user) => {
    const message = `Thanks to @${user} for subscribing to the channel!`;
    sirenachanBot.say(channel, message);
  });

  sirenachanBot.onResub((channel, user, subInfo) => {
    const message = `Thanks to @${user} for subscribing to the channel for a total of ${subInfo.months} months!`;
    sirenachanBot.say(channel, message);
  });

  sirenachanBot.onSubGift((channel, recipient, subInfo) => {
    const user = subInfo.gifter;
    const previousGiftCount = giftCounts.get(user) ?? 0;

    if (previousGiftCount > 0) {
      giftCounts.set(user, previousGiftCount - 1);
    } else {
      sirenachanBot.say(channel, `Thanks ${user} for gifting a sub to ${recipient}!`);
    }
  });

  sirenachanBot.onCommunitySub((channel, user, subInfo) => {
    const previousGiftCount = giftCounts.get(user) ?? 0;
    const message = `Thanks ${user} for gifting ${subInfo.count} subs to the community!`;

    giftCounts.set(user, previousGiftCount + subInfo.count);
    sirenachanBot.say(channel, message);
  });
}

main();
