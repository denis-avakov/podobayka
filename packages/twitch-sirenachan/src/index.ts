import dotenv from 'dotenv';
import cron from 'node-cron';
import convertLayout from 'convert-layout/uk';

import auth from 'api/auth';
import chatter from 'api/chatter';
import checkTriggers from 'utils/checkTriggers';
import directoryLoader from 'utils/directoryLoader';
import { CHANNEL } from 'utils/vars';

dotenv.config();

async function main() {
  if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
    throw new Error('TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET must be set');
  }

  const sirenachanBot = await auth.getChatClient();
  const eventSubListener = await auth.getEventSubListener();

  const commands = await directoryLoader('../commands');
  console.log('Loading commands...');

  const timers = await directoryLoader('../timers');
  console.log('Loading timers...');

  await sirenachanBot.onRegister(async () => {
    const mods = await sirenachanBot.getMods(CHANNEL.name);
    console.log('Mods:', mods);
  });

  await sirenachanBot.onWhisper((user, message) => {
    console.log(user, message);
  });

  await sirenachanBot.onConnect(() => {
    console.log('🔥');
  });

  sirenachanBot.onMessage(async (channel, user, userMessage, msg) => {
    const userMessageText = userMessage.toLocaleLowerCase().trim();

    await chatter.store({
      channelId: msg.channelId,
      messageId: msg.id,
      userId: msg.userInfo.userId,
      userName: msg.userInfo.userName,
      message: userMessageText
    });

    if (checkTriggers.some(userMessageText, ['ё', 'ъ', 'ы', 'э'])) {
      sirenachanBot.deleteMessage(channel, msg.id);
      sirenachanBot.say(channel, `${user}, не пиши російською у чаті ReallyMad`);
      return;
    }

    if (checkTriggers.some(userMessageText, ['!ой', '!ops', '~'])) {
      const previousMessage = await chatter.getPreviousMessage(msg.userInfo.userId);

      if (previousMessage) {
        const text = convertLayout.fromEn(previousMessage);
        sirenachanBot.say(channel, `${user}, сказав: ${text}`);
      } else {
        sirenachanBot.say(channel, `${user}, не можу знайти попереднє повідомлення`);
      }
    }

    for (const command of commands) {
      if (command.triggers.includes(userMessageText)) {
        const response = await command.run(user, userMessage);
        sirenachanBot.say(channel, response);
        return;
      }
    }
  });

  let currentTimer = 0;
  cron.schedule('*/5 * * * *', () => {
    currentTimer = (currentTimer + 1) % timers.length;
    const response = timers[currentTimer].run();
    sirenachanBot.say(CHANNEL.name, response);
  });

  // await eventSubListener.subscribeToChannelCheerEvents(CHANNEL.id, (event) => {
  //   const response = `${event.userDisplayName} just cheered ${event.bits} bits!`;
  //   sirenachanBot.say(CHANNEL.name, response);
  // });

  await eventSubListener.subscribeToChannelFollowEvents(CHANNEL.id, (event) => {
    const response = `${event.userDisplayName} just followed!`;
    sirenachanBot.say(CHANNEL.name, response);
  });

  // await eventSubListener.subscribeToChannelGoalBeginEvents(CHANNEL.id, (event) => {
  //   const response = `${event.broadcasterDisplayName} just started a goal!`;
  //   sirenachanBot.say(CHANNEL.name, response);
  // });

  // await eventSubListener.subscribeToChannelGoalEndEvents(CHANNEL.id, (event) => {
  //   const response = `${event.broadcasterDisplayName} just ended a goal!`;
  //   sirenachanBot.say(CHANNEL.name, response);
  // });

  // await eventSubListener.subscribeToChannelGoalProgressEvents(CHANNEL.id, (event) => {
  //   const response = `${event.broadcasterDisplayName} just made a progress!`;
  //   sirenachanBot.say(CHANNEL.name, response);
  // });

  // await eventSubListener.subscribeToChannelHypeTrainBeginEvents(CHANNEL.id, (event) => {
  //   const response = `${event.broadcasterDisplayName} just started a hype train!`;
  //   sirenachanBot.say(CHANNEL.name, response);
  // });

  // await eventSubListener.subscribeToChannelHypeTrainEndEvents(CHANNEL.id, (event) => {
  //   const response = `${event.broadcasterDisplayName} just ended a hype train!`;
  //   sirenachanBot.say(CHANNEL.name, response);
  // });

  // await eventSubListener.subscribeToChannelHypeTrainProgressEvents(CHANNEL.id, (event) => {
  //   const response = `${event.broadcasterDisplayName} just made a progress!`;
  //   sirenachanBot.say(CHANNEL.name, response);
  // });

  // await eventSubListener.subscribeToChannelPollBeginEvents(CHANNEL.id, (event) => {
  //   const response = `${event.broadcasterDisplayName} just started a poll!`;
  //   sirenachanBot.say(CHANNEL.name, response);
  // });

  // await eventSubListener.subscribeToChannelPollEndEvents(CHANNEL.id, (event) => {
  //   const response = `${event.broadcasterDisplayName} just ended a poll!`;
  //   sirenachanBot.say(CHANNEL.name, response);
  // });

  // await eventSubListener.subscribeToChannelPredictionBeginEvents(CHANNEL.id, (event) => {
  //   const response = `${event.broadcasterDisplayName} just started a prediction!`;
  //   sirenachanBot.say(CHANNEL.name, response);
  // });

  // await eventSubListener.subscribeToChannelPredictionEndEvents(CHANNEL.id, (event) => {
  //   const response = `${event.broadcasterDisplayName} just ended a prediction!`;
  //   sirenachanBot.say(CHANNEL.name, response);
  // });

  // await eventSubListener.subscribeToChannelPredictionLockEvents(CHANNEL.id, (event) => {
  //   const response = `${event.broadcasterDisplayName} just locked a prediction!`;
  //   sirenachanBot.say(CHANNEL.name, response);
  // });

  await eventSubListener.subscribeToChannelRaidEventsFrom(CHANNEL.id, (event) => {
    const response = `${event.raidingBroadcasterDisplayName} going to raid!`;
    sirenachanBot.say(CHANNEL.name, response);
  });

  await eventSubListener.subscribeToChannelRaidEventsTo(CHANNEL.id, (event) => {
    const response = `${event.raidedBroadcasterDisplayName} just raided!`;
    sirenachanBot.say(CHANNEL.name, response);
  });

  await eventSubListener.subscribeToChannelRedemptionAddEvents(CHANNEL.id, (event) => {
    const response = `${event.userDisplayName} just added a redemption!`;
    sirenachanBot.say(CHANNEL.name, response);
  });

  // await eventSubListener.subscribeToChannelSubscriptionEvents(CHANNEL.id, (event) => {
  //   const response = `@${event.userDisplayName}, дякую, дуже дякую за підписку 💜`;
  //   sirenachanBot.say(CHANNEL.name, response);
  // });

  // await eventSubListener.subscribeToChannelSubscriptionGiftEvents(CHANNEL.id, (event) => {
  //   const response = `Ував увавчики, дякую ${event.gifterDisplayName} за ${event.amount} подарованих підписок. Цьом в носик 💜`;
  //   sirenachanBot.say(CHANNEL.name, response);
  // });

  // await eventSubListener.subscribeToChannelSubscriptionMessageEvents(CHANNEL.id, (event) => {
  //   const response = `Вітаю, дякую ${event.userDisplayName} за підписку! 💜`;
  //   sirenachanBot.say(CHANNEL.name, response);
  // });

  await eventSubListener.subscribeToStreamOfflineEvents(CHANNEL.id, (event) => {
    const response = `${event.broadcasterDisplayName} just went offline!`;
    sirenachanBot.say(CHANNEL.name, response);
  });

  await eventSubListener.subscribeToStreamOnlineEvents(CHANNEL.id, (event) => {
    const response = `${event.broadcasterDisplayName} just came online!`;
    sirenachanBot.say(CHANNEL.name, response);
  });

  await sirenachanBot.connect();
  await eventSubListener.listen();
}

main();
