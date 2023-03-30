import type { Triggers } from 'utils/types';

function some(wordsList: string | string[], triggersList: string[]) {
  return triggersList.some((trigger) => wordsList.includes(trigger));
}

function every(wordsList: string | string[], triggersList: string[]) {
  return triggersList.every((trigger) => wordsList.includes(trigger));
}

function isMatch(userMessage: string, triggers: Triggers) {
  const userMessageText = userMessage.toLocaleLowerCase();

  if (triggers.firstWord) {
    const wordsList = userMessageText.split(' ');
    return some(wordsList[0], triggers.firstWord);
  }

  if (triggers.any) {
    return triggers.any.some((trigger) => {
      if (Array.isArray(trigger)) {
        return every(userMessageText, trigger);
      }

      return userMessageText.includes(trigger);
    });
  }

  return false;
}

export default {
  some,
  every,
  isMatch
};
