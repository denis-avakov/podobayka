import { every, some, includes } from 'lodash';

function parseMessageToWordsList(message: string) {
  return message.trim().toLowerCase().split(' ');
}

export default {
  some: (message: string, triggersList: string[]) => {
    const wordsList = parseMessageToWordsList(message);
    return some(triggersList, (trigger) => includes(wordsList, trigger));
  },
  every: (message: string, triggersList: string[]) => {
    const wordsList = parseMessageToWordsList(message);
    return every(triggersList, (trigger) => includes(wordsList, trigger));
  }
};
