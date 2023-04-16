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

  const commands = await featuresLoader('src/features/commands/**/*.{js,ts}');
  console.log('Loading commands...', commands.length);

  const timers = await featuresLoader('src/features/timers/**/*.{js,ts}');
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

  let deathCounter = 57;
  let burpCounter = 0;

  sirenachanBot.onMessage(async (channel, user, userMessage, msg) => {
    // do nothing if the message is from the bot
    if (user === sirenachanBot.currentNick) {
      return;
    }

    if ((userMessage.includes('где') && userMessage.includes('вебка')) || (userMessage.includes('де') && userMessage.includes('вебка'))) {
      sirenachanBot.say(channel, `${user} в пєзді пошукай`);
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
      sirenachanBot.say(channel, `йомайо Brooooo`);
      return;
    }

    if (userMessage.includes('тойво') || userMessage.includes('цейво')) {
      sirenachanBot.say(channel, `Цейво... забув PepoThink`);
      return;
    }

    if (userMessage.includes('база') || userMessage.includes('цейво')) {
      sirenachanBot.say(channel, `Ґрунт 😎 База 😎 так би мовити — Основа 😎 Стрижень 😎 Наріжний камінь 😎 Фундамент 😎 Твердиня 😎 Осердя 😎 Підвалина 😎 Моноліт 😎 Літосферна плита 😎 Серцевина`);
      return;
    }

    if ((userMessage.includes('крісло') && userMessage.includes('стрімить')) || (userMessage.includes('стілець') && userMessage.includes('стрімить'))) {
      sirenachanBot.say(channel, `Бля де вона? 77? Ахахахаха вона що зі стріму пішла?!? Аахаха ляя у вас стрімер пішов зі стріму?! Просто встав і пішов??? ХАХаххахаха Стілець стрімить чи шо?! АУУУ! Може вона там подавилася водою або об кут спіткнулася і непритомна валяється!! Ахаха Ну гаразд, я тоді теж візьму і піду і не буду нічого не писати поки не прийде`);
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
        sirenachanBot.say(channel, `@${user}, ок, чуваче Awkward`);
      }
    }

    if (['!риг'].includes(userMessageWordsList[0])) {
      if ([...moderatorList.getList()].includes(user)) {
        burpCounter += 1;
        sirenachanBot.say(channel, `Ашалєть, Сиреночка ригнула на стрімі ${burpCounter} раз DonkSass`);
      }
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

          sirenachanBot.say(channel, `@${user} зараз нічого не грає ${randomEmote}`);
        } else {
          sirenachanBot.say(
            channel,
            `@${user} ${currentSongData.item.name} - ${currentSongData.item.artists[0].name}`
          );
        }
      } catch (error) {
        console.log('_ error', error);
        sirenachanBot.say(channel, `@${user} ой друже шото мені хуйовааааа`);
      }

      // console.log('_', currentSongData);
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

        sirenachanBot.say(channel, `@${user} ${message}`);
      } else {
        sirenachanBot.say(channel, `@${user} You are not following!`);
      }
    }

    if (checkTriggers.isMatch(userMessage, { any: ['ё', 'ъ', 'ы', 'э'] })) {
      if (!['antos_', 'v4dolas'].includes(user)) {
        try {
          await sirenachanBot.deleteMessage(channel, msg.id);
        } catch (error) {
          console.log(`An error occurred while deleting the message of user ${user}:`, error);
        }

        sirenachanBot.say(channel, `@${user}, не пиши російською у чаті ReallyMad`);
        return;
      }
    }

    if (checkTriggers.isMatch(userMessage, { firstWord: ['!ой', '!ops'] })) {
      const previousMessage = await chatterList.getPreviousMessage(msg.userInfo.userName);

      if (previousMessage) {
        const text = convertLayout.fromEn(previousMessage);
        sirenachanBot.say(channel, `${user}, сказав: ${text}`);
      } else {
        sirenachanBot.say(channel, `${user}, не можу знайти попереднє повідомлення`);
      }

      return;
    }

    for (const command of commands) {
      if (!command.triggers?.firstWord || !command.onMessage) {
        continue;
      }

      if (checkTriggers.some(userMessageWordsList[0], command.triggers.firstWord)) {
        const response = await command.onMessage(user, userMessageWordsList);
        sirenachanBot.say(channel, response);
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

  let cursorTimer = 0;
  cron.schedule('*/5 * * * *', async () => {
    if (await apiClient.streams.getStreamByUserId(CHANNEL.id)) {
      const currentTimer = timers[cursorTimer].onTimer;

      if (typeof currentTimer === 'function') {
        sirenachanBot.say(CHANNEL.name, currentTimer());
      }
    }

    cursorTimer = (cursorTimer + 1) % timers.length;
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
    const response = `RAAAAID by ${event.raidedBroadcasterName}!`;
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

    chatterList.clear();
  });

  await eventSubListener.subscribeToStreamOnlineEvents(CHANNEL.id, (event) => {
    const response = `${event.broadcasterDisplayName} just came online!`;
    sirenachanBot.say(CHANNEL.name, response);

    chatterList.clear();
  });

  await sirenachanBot.connect();
  await eventSubListener.listen();
}

main();
