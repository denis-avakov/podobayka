import { sample } from 'lodash';

export default {
  triggers: ['!song', '!currentsong', '!playlist'],
  run: (user: string, message?: string) => {
    return `catDisco ${user}, туво є файний плейлист з українською музикою, заціни! https://open.spotify.com/playlist/3tq9T5P47gPwxQ7nzq6uiI?si=4cb345d796344a59 catDisco`;
  }
};
