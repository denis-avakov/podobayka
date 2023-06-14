import dotenv from 'dotenv';
import cron from 'node-cron';
import convertLayout from 'convert-layout/uk';

import { intervalToDuration, formatDuration } from 'date-fns';
import * as duration from 'duration-fns';

import createApiClient from 'clients/apiClient';
import createChatClient from 'clients/chatClient';
import createEventSubListener from 'clients/eventSubListener';

import user from 'models/user';
import twitchToken from 'models/twitchToken';

import moderatorList from 'cache/moderatorList';
import chatterList from 'cache/chatterList';

import featuresLoader from 'utils/featuresLoader';
import checkTriggers from 'utils/checkTriggers';
import pickRandom from 'utils/pickRandom';

dotenv.config();

function isChatPyramid(chat: string) {
  const messages = chat.split('\n');

  for (let i = 0; i < messages.length; i++) {
    const message = messages[i];

    for (let j = i + 1; j < messages.length; j++) {
      const nextMessage = messages[j];

      if (countRepeatedWords(message) >= countRepeatedWords(nextMessage)) {
        return false;
      }
    }
  }

  return true;
}

function countRepeatedWords(message: string) {
  const words = message.trim().split(' ');
  const wordCount: any = {};

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    wordCount[word] = (wordCount[word] || 0) + 1;
  }

  let repeatedCount = 0;
  for (const word in wordCount) {
    if (wordCount[word] > 1) {
      repeatedCount++;
    }
  }

  return repeatedCount;
}

function hasRepeatedWords(message: string) {
  const words = message.trim().split(' ');
  const uniqueWords = new Set(words);

  return uniqueWords.size < words.length;
}

async function main() {
  const currentTwitchToken = await Promise.resolve()
    .then(() => user.get('anerisun'))
    .then((userProfile) => twitchToken.get(userProfile.id));

  const apiClient = createApiClient();
  const sirenachanBot = await createChatClient(currentTwitchToken);
  const eventSubListener = await createEventSubListener();

  const CHANNEL = {
    name: currentTwitchToken.userName,
    id: currentTwitchToken.userId
  };

  sirenachanBot.onAuthenticationFailure((channel, text) => {
    console.log('_', channel, text);
  });
  sirenachanBot.onTokenFetchFailure((error) => {
    console.log('_', error);
  });

  await sirenachanBot.onWhisper(async (user, message) => {
    if (moderatorList.getList().includes(user)) {
      sirenachanBot.say(CHANNEL.name, message);
    }

    console.log(user, message);
  });

  const commands = await featuresLoader('src/features/commands/**/*.{js,ts}');
  console.log('Loading commands...', commands.length);

  const timers = await featuresLoader('src/features/timers/**/*.{js,ts}');
  console.log('Loading timers...', timers, timers.length);

  // await sirenachanBot.onRegister(async () => {
  //   // const mods = await apiClient.moderation.getModerators(CHANNEL.name);
  //   // [...mods.data, CHANNEL.name].forEach((value) => moderatorList.set(value.toString()));
  //   ['akilla7', 'astound_ing', 'elriwen', 'SIENABOT', 'soony', 'den3er', CHANNEL.name].forEach(
  //     (value) => moderatorList.set(value)
  //   );
  // });

  ['akilla7', 'astound_ing', 'elriwen', 'SIENABOT', 'soony', 'den3er', CHANNEL.name].forEach(
    (value) => moderatorList.set(value)
  );

  await sirenachanBot.onWhisper(async (user, message) => {
    if (moderatorList.getList().includes(user)) {
      sirenachanBot.say(CHANNEL.name, message);
    }

    console.log(user, message);
  });

  await sirenachanBot.onConnect(() => {
    console.log('🔥');
  });

  let deathCounter = 57;
  let burpCounter = 99445;

  let currentStreak = 0;
  let currentStreakWord = '';
  let currentStreakMessages = [];

  sirenachanBot.onMessage(async (channel, user, userMessage, msg) => {
    // do nothing if the message is from the bot
    if (user === 'sienabot') {
      return;
    }

    // Emote Pyramids
    const messageTags = userMessage.split(' ').filter((text) => text);

    if (currentStreak === 0 && messageTags.length === 1) {
      currentStreak += 1;
      currentStreakWord = messageTags[0];
    }

    if (currentStreak >= 1 && messageTags.length >= 1) {
      if (hasRepeatedWords(userMessage)) {
        currentStreakMessages.push(userMessage);
      }
    }
    // - - -

    if (
      (userMessage.includes('где') && userMessage.includes('вебка')) ||
      (userMessage.includes('де') && userMessage.includes('вебка')) ||
      (userMessage.includes('де') && userMessage.includes('вебочка')) ||
      (userMessage.includes('где') && userMessage.includes('вебочка'))
    ) {
      sirenachanBot.say(channel, `/me ${user} в пєзді пошукай`);
      return;
    }

    if (userMessage.includes('xdding')) {
      sirenachanBot.say(channel, `xdding`);
      return;
    }

    if (userMessage.includes('xddkiss')) {
      sirenachanBot.say(channel, `xddkiss`);
      return;
    }

    if (userMessage.includes('йомайо')) {
      sirenachanBot.say(channel, `/me йомайо Brooooo`);
      return;
    }

    if (userMessage.includes('тойво') || userMessage.includes('цейво')) {
      sirenachanBot.say(channel, `/me Цейво... забув PepoThink`);
      return;
    }

    if (userMessage.includes('база') || userMessage.includes('цейво')) {
      sirenachanBot.say(
        channel,
        `/me Ґрунт 😎 База 😎 так би мовити — Основа 😎 Стрижень 😎 Наріжний камінь 😎 Фундамент 😎 Твердиня 😎 Осердя 😎 Підвалина 😎 Моноліт 😎 Літосферна плита 😎 Серцевина`
      );
      return;
    }

    if (
      (userMessage.includes('крісло') && userMessage.includes('стрімить')) ||
      (userMessage.includes('стілець') && userMessage.includes('стрімить'))
    ) {
      sirenachanBot.say(
        channel,
        `/me Бля де вона? 77? Ахахахаха вона що зі стріму пішла?!? Аахаха ляя у вас стрімер пішов зі стріму?! Просто встав і пішов??? ХАХаххахаха Стілець стрімить чи шо?! АУУУ! Може вона там подавилася водою або об кут спіткнулася і непритомна валяється!! Ахаха Ну гаразд, я тоді теж візьму і піду і не буду нічого не писати поки не прийде`
      );
      return;
    }

    const userMessageWordsList = userMessage.toLocaleLowerCase().split(' ');
    const randomEmote = pickRandom(['Threw', 'borpaSpin', 'Awkward', 'pepeLaughAngry', 'catSad']);

    if (['!death', '!dd'].includes(userMessageWordsList[0])) {
      sirenachanBot.say(channel, `/me сирена чан вмерла вже ${deathCounter} разів ${randomEmote}`);
    }

    if (['!death-add', '!dd+'].includes(userMessageWordsList[0])) {
      if ([...moderatorList.getList(), 'reni_min'].includes(user)) {
        deathCounter += 1;
        sirenachanBot.say(
          channel,
          pickRandom([`/me ще одна смерть, всього тепер ${deathCounter} ${randomEmote}`])
        );
      }
    }

    if (['!death-rm', '!dd-'].includes(userMessageWordsList[0])) {
      if ([...moderatorList.getList(), 'reni_min'].includes(user)) {
        deathCounter -= 1;
        sirenachanBot.say(channel, `/me @${user}, ок, чуваче Awkward`);
      }
    }

    if (['!риг'].includes(userMessageWordsList[0])) {
      burpCounter += 1;
      sirenachanBot.say(
        channel,
        `/me Ашалєть, Сиреночка ригнула на стрімі ${burpCounter} раз DonkSass`
      );
    }

    if (['!current-song', '!song', '!music', '!трек'].includes(userMessage)) {
      try {
        const currentSongResponse = await fetch(
          'https://spotify.denis-avakov.workers.dev/get-now-playing'
        );
        const currentSongData = await currentSongResponse.json();

        if (currentSongData.hasOwnProperty('ERROR')) {
          const randomEmote = pickRandom([
            'peepoSleep',
            'British',
            'catRose',
            'Shruge',
            'pEEEsda',
            'BLUBBERSWTF',
            'RAGEY'
          ]);

          sirenachanBot.say(channel, `/me @${user} зараз нічого не грає ${randomEmote}`);
        } else {
          sirenachanBot.say(
            channel,
            `/me @${user} ${currentSongData.item.name} - ${currentSongData.item.artists[0].name}`
          );
        }
      } catch (error) {
        console.log('_ error', error);
        sirenachanBot.say(channel, `/me @${user} ой друже шото мені хуйовааааа`);
      }
    }

    if (userMessage === '!followage') {
      const follow = await apiClient.users.getFollowFromUserToBroadcaster(
        msg.userInfo.userId,
        msg.channelId!
      );

      if (follow) {
        const durationResult = intervalToDuration({
          start: follow.followDate.getTime(),
          end: Date.now()
        });

        const humanFormat = formatDuration(durationResult);

        const seconds = duration.toSeconds(durationResult);
        const minutes = duration.toMinutes(durationResult);
        const days = duration.toDays(durationResult);

        const message = pickRandom([
          `hmm you have been following for ${humanFormat}`,
          'if youre interested, you have been following for ${humanFormat}',
          '*sigh*',
          'counting things is hard',
          `uh... you have been following for ${humanFormat}`,
          `phew! maaan. you have been following for ${humanFormat}`,
          `you have been following for ${humanFormat} and i think that's pretty good!`,
          `i hope you like it: ${humanFormat}`,
          `here you go... ${humanFormat}`,
          `um... you have been following for ${seconds} seconds....`,
          `woah! that's ${minutes} minutes you have been following....`,
          'so... [object object] hope you like it',
          `in days it will be ${days}`,
          'no problem today is 2 november',
          `you can have this ${humanFormat}`,
          `geez you've been here for ${minutes} minutes`,
          `i'm kinda busy right now`,
          `спочатку кажи: Фелікс ти топ продовжуй в тому ж дусі!!!`
        ]);

        sirenachanBot.say(channel, `/me @${user} ${message}`);
      } else {
        sirenachanBot.say(channel, `/me @${user} You are not following!`);
      }
    }

    if (checkTriggers.isMatch(userMessage, { any: ['ё', 'ъ', 'ы', 'э'] })) {
      if (!['antos_', 'v4dolas'].includes(user)) {
        try {
          // TODO
          // await sirenachanBot.deleteMessage(channel, msg.id);
        } catch (error) {
          console.log(`An error occurred while deleting the message of user ${user}:`, error);
        }

        sirenachanBot.say(channel, `/me @${user}, не пиши російською у чаті ReallyMad`);
        return;
      }
    }

    if (checkTriggers.isMatch(userMessage, { firstWord: ['!ой', '!ops'] })) {
      const previousMessage = await chatterList.getPreviousMessage(msg.userInfo.userName);

      if (previousMessage) {
        const text = convertLayout.fromEn(previousMessage);
        sirenachanBot.say(channel, `/me ${user}, сказав: ${text}`);
      } else {
        sirenachanBot.say(channel, `/me ${user}, не можу знайти попереднє повідомлення`);
      }

      return;
    }

    for (const command of commands) {
      if (!command.triggers?.firstWord || !command.onMessage) {
        continue;
      }

      if (checkTriggers.some(userMessageWordsList[0], command.triggers.firstWord)) {
        const response = await command.onMessage(user, userMessageWordsList);
        sirenachanBot.say(channel, '/me ' + response);
        return;
      }
    }

    chatterList.set(msg.userInfo.userName, {
      channelId: msg.channelId,
      messageId: msg.id,
      userId: msg.userInfo.userId,
      userName: msg.userInfo.userName,
      message: userMessage
    });
  });

  let cursorTimer = 2;
  cron.schedule('*/10 * * * *', async () => {
    const currentTimer = timers[cursorTimer].onTimer;

    if (typeof currentTimer === 'function') {
      sirenachanBot.say(CHANNEL.name, '/me ' + currentTimer());
    }

    if (await apiClient.streams.getStreamByUserId(CHANNEL.id)) {
      const currentTimer = timers[cursorTimer].onTimer;
      if (typeof currentTimer === 'function') {
        sirenachanBot.say(CHANNEL.name, '/me ' + currentTimer());
      }
    }

    cursorTimer = (cursorTimer + 1) % timers.length;
  });

  // await eventSubListener.onChannelCheer(CHANNEL.id, (event) => {
  //   const response = `${event.userDisplayName} just cheered ${event.bits} bits!`;
  //   sirenachanBot.say(CHANNEL.name, response);
  // });

  eventSubListener.onSubscriptionCreateFailure((subscription, error) => {
    console.log('_ onSubscriptionCreateFailure', subscription, error);
  });

  await eventSubListener.onChannelGoalBegin(CHANNEL.id, (event) => {
    const response = `/me ${event.broadcasterDisplayName} just started a goal!`;
    sirenachanBot.say(CHANNEL.name, response);
  });

  await eventSubListener.onChannelGoalEnd(CHANNEL.id, (event) => {
    const response = `/me ${event.broadcasterDisplayName} just ended a goal!`;
    sirenachanBot.say(CHANNEL.name, response);
  });

  await eventSubListener.onChannelGoalProgress(CHANNEL.id, (event) => {
    const response = `/me ${event.broadcasterDisplayName} just made a progress!`;
    sirenachanBot.say(CHANNEL.name, response);
  });

  await eventSubListener.onChannelHypeTrainBegin(CHANNEL.id, (event) => {
    const response = `/me ${event.broadcasterDisplayName} just started a hype train!`;
    sirenachanBot.say(CHANNEL.name, response);
  });

  await eventSubListener.onChannelHypeTrainEnd(CHANNEL.id, (event) => {
    const response = `/me ${event.broadcasterDisplayName} just ended a hype train!`;
    sirenachanBot.say(CHANNEL.name, response);
  });

  await eventSubListener.onChannelHypeTrainProgress(CHANNEL.id, (event) => {
    const response = `/me ${event.broadcasterDisplayName} just made a progress!`;
    sirenachanBot.say(CHANNEL.name, response);
  });

  await eventSubListener.onChannelPollBegin(CHANNEL.id, (event) => {
    const response = `/me ${event.broadcasterDisplayName} just started a poll!`;
    sirenachanBot.say(CHANNEL.name, response);
  });

  await eventSubListener.onChannelPollEnd(CHANNEL.id, (event) => {
    const response = `/me ${event.broadcasterDisplayName} just ended a poll!`;
    sirenachanBot.say(CHANNEL.name, response);
  });

  await eventSubListener.onChannelPollProgress(CHANNEL.id, (event) => {
    const response = `/me ${event.broadcasterDisplayName} just started a prediction!`;
    sirenachanBot.say(CHANNEL.name, response);
  });

  await eventSubListener.onChannelPredictionEnd(CHANNEL.id, (event) => {
    const response = `/me ${event.broadcasterDisplayName} just ended a prediction!`;
    sirenachanBot.say(CHANNEL.name, response);
  });

  await eventSubListener.onChannelPredictionLock(CHANNEL.id, (event) => {
    const response = `/me ${event.broadcasterDisplayName} just locked a prediction!`;
    sirenachanBot.say(CHANNEL.name, response);
  });

  await eventSubListener.onChannelRaidFrom(CHANNEL.id, async (event) => {
    const name = await event.getRaidedBroadcaster();
    const response = `/me RAAAAID by ${name}!`;
    sirenachanBot.say(CHANNEL.name, response);
  });

  await eventSubListener.onChannelRaidTo(CHANNEL.id, async (event) => {
    const name = await event.getRaidingBroadcaster();
    const response = `/me ${name} going to raid!`;
    sirenachanBot.say(CHANNEL.name, response);
  });

  await eventSubListener.onChannelRedemptionAdd(CHANNEL.id, (event) => {
    const response = `/me ${event.userDisplayName} just added a redemption!`;
    sirenachanBot.say(CHANNEL.name, response);
  });

  await eventSubListener.onChannelFollow(CHANNEL.id, (event) => {
    const response = `/me @${event.userDisplayName}, дякую, дуже дякую за підписку 💜`;
    sirenachanBot.say(CHANNEL.name, response);
  });

  await eventSubListener.onChannelSubscriptionGift(CHANNEL.id, (event) => {
    const response = `/me Ував увавчики, дякую ${event.gifterDisplayName} за ${event.amount} подарованих підписок. Цьом в носик 💜`;
    sirenachanBot.say(CHANNEL.name, response);
  });

  await eventSubListener.onChannelSubscription(CHANNEL.id, (event) => {
    const response = `/me Вітаю, дякую ${event.userDisplayName} за підписку! 💜`;
    sirenachanBot.say(CHANNEL.name, response);
  });

  await eventSubListener.onStreamOffline(CHANNEL.id, (event) => {
    const response = `/me ${event.broadcasterDisplayName} just went offline!`;
    sirenachanBot.say(CHANNEL.name, response);

    chatterList.clear();
  });

  await eventSubListener.onStreamOnline(CHANNEL.id, (event) => {
    const response = `/me ${event.broadcasterDisplayName} just came online!`;
    sirenachanBot.say(CHANNEL.name, response);

    chatterList.clear();
  });

  await sirenachanBot.connect();
  await eventSubListener.start();
}

main();
