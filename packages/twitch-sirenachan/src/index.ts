import dotenv from 'dotenv';
import cron from 'node-cron';
import convertLayout from 'convert-layout/uk';

import createApiClient from 'clients/apiClient';
import createEventSubListener from 'clients/eventSubListener';
import createChatClient from 'clients/chatClient';

import twitchToken from 'models/twitchToken';
import user from 'models/user';

import chatterList from 'cache/chatterList';
import moderatorList from 'cache/moderatorList';

import checkTriggers from 'utils/checkTriggers';
import directoryLoader from 'utils/directoryLoader';

dotenv.config();

async function main() {
  const currentTwitchToken = await Promise.resolve()
    .then(() => user.get('Sirenachan'))
    .then((userProfile) => twitchToken.get(userProfile.id));

  const apiClient = createApiClient();
  const sirenachanBot = await createChatClient(currentTwitchToken);
  const eventSubListener = await createEventSubListener(apiClient);

  const CHANNEL = {
    name: currentTwitchToken.userName,
    id: currentTwitchToken.userId
  };

  const commands = await directoryLoader('src/commands/**/*.ts');
  console.log('Loading commands...', commands.length);

  const timers = await directoryLoader('src/timers/**/*.ts');
  console.log('Loading timers...', timers.length);

  await sirenachanBot.onRegister(async () => {
    const mods = await sirenachanBot.getMods(CHANNEL.name);
    [...mods, CHANNEL.name].forEach((value) => moderatorList.set(value));
  });

  await sirenachanBot.onWhisper((user, message) => {
    if (moderatorList.getList().includes(user)) {
      sirenachanBot.say(CHANNEL.name, message);
    }

    console.log(user, message);
  });

  await sirenachanBot.onConnect(() => {
    console.log('🔥');
  });

  sirenachanBot.onMessage(async (channel, user, userMessage, msg) => {
    // do nothing if the message is from the bot
    if (user === sirenachanBot.currentNick) {
      return;
    }

    const userMessageText = userMessage.toLocaleLowerCase().trim();

    chatterList.set(msg.userInfo.userName, {
      channelId: msg.channelId,
      messageId: msg.id,
      userId: msg.userInfo.userId,
      userName: msg.userInfo.userName,
      message: userMessageText
    });

    if (checkTriggers.some(userMessageText, ['ё', 'ъ', 'ы', 'э'])) {
      try {
        await sirenachanBot.deleteMessage(channel, msg.id);
      } catch (error) {
        console.log(`An error occurred while deleting the message of user ${user}:`, error);
      }

      sirenachanBot.say(channel, `${user}, не пиши російською у чаті ReallyMad`);
      return;
    }

    if (checkTriggers.some(userMessageText, ['!ой', '!ops', '~'])) {
      const previousMessage = await chatterList.getPreviousMessage(msg.userInfo.userId);

      if (previousMessage) {
        const text = convertLayout.fromEn(previousMessage);
        sirenachanBot.say(channel, `${user}, сказав: ${text}`);
      } else {
        sirenachanBot.say(channel, `${user}, не можу знайти попереднє повідомлення`);
      }

      return;
    }

    for (const command of commands) {
      if (command.triggers.includes(userMessageText)) {
        const response = await command.run(user, userMessage);
        sirenachanBot.say(channel, response);
        return;
      }
    }
  });

  let cursorTimer = 0;
  cron.schedule('*/5 * * * *', async () => {
    if (await apiClient.streams.getStreamByUserId(CHANNEL.id)) {
      cursorTimer = (cursorTimer + 1) % timers.length;
      const response = timers[cursorTimer].run();
      sirenachanBot.say(CHANNEL.name, response);
    }
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
