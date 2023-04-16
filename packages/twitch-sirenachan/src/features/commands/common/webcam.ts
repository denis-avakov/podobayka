import chatterList from 'cache/chatterList';
import type { FeatureFile } from 'utils/types';

export const feature: FeatureFile = {
  triggers: {
    firstWord: ['!вебка', '!webcam', '!vebka', 'вебка']
  },
  onMessage: (userName) => {
    return `вебка крінж PepoThink`;
  }
};
