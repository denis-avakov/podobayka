import dotenv from 'dotenv';
import cron from 'node-cron';

import auth from 'auth';
import directoryLoader from 'utils/directoryLoader';
import saveUser from 'utils/saveUser';
import { CHANNEL } from 'utils/vars';

dotenv.config();

async function main() {
  if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
    throw new Error('TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET must be set');
  }

  const sirenachanBot = await auth.getChatClient();
  const eventSubListener = await auth.getEventSubListener();

  const commands = await directoryLoader('./src/commands/**/*.ts');
  console.log('Loading commands...');

  const timers = await directoryLoader('./src/timers/**/*.ts');
  console.log('Loading timers...');

  await sirenachanBot.onConnect(() => {
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

  // await eventSubListener.subscribeToChannelRaidEventsFrom(CHANNEL.id, (event) => {
  //   const response = `${event.raidingBroadcasterDisplayName} going to raid!`;
  //   sirenachanBot.say(CHANNEL.name, response);
  // });

  // await eventSubListener.subscribeToChannelRaidEventsTo(CHANNEL.id, (event) => {
  //   const response = `${event.raidedBroadcasterDisplayName} just raided!`;
  //   sirenachanBot.say(CHANNEL.name, response);
  // });

  // await eventSubListener.subscribeToChannelRedemptionAddEvents(CHANNEL.id, (event) => {
  //   const response = `${event.userDisplayName} just added a redemption!`;
  //   sirenachanBot.say(CHANNEL.name, response);
  // });

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

  // await eventSubListener.subscribeToStreamOfflineEvents(CHANNEL.id, (event) => {
  //   const response = `${event.broadcasterDisplayName} just went offline!`;
  //   sirenachanBot.say(CHANNEL.name, response);
  // });

  // await eventSubListener.subscribeToStreamOnlineEvents(CHANNEL.id, (event) => {
  //   const response = `${event.broadcasterDisplayName} just came online!`;
  //   sirenachanBot.say(CHANNEL.name, response);
  // });

  await sirenachanBot.connect();
  await eventSubListener.listen();
}

main();
