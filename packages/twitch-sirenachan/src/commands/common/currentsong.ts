import { sample } from 'lodash';

export default {
  triggers: ['!song', '!currentsong', '!playlist'],
  run: (user: string, message?: string) => {
    return 'Скажіть будь ласка @sirena_chan PauseChamp';
  }
};
