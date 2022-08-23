import { sample } from 'lodash';
import moderatorList from 'cache/moderatorList';

export default {
  triggers: ['!discord', '!ds', '!dis', '!діс'],
  run: (user: string) => {
    if (moderatorList.getList().includes(user)) {
      return sample([
        '/announce шановні чілібосіки, чіли та пчілки, заходьте, будь ласка, в діскорд https://discord.gg/FgkgzzDRWJ',
        '/announce доречі, шановні, хто не знав то там є дискорді канал, ми там хіхікаєм, і дивимось хорні перед сном, швиденько долучайтесь https://discord.gg/FgkgzzDRWJ'
      ]);
    }

    return `${user} https://discord.gg/FgkgzzDRWJ`;
  }
};
