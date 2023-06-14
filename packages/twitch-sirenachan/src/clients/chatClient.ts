import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';
import type { TwitchToken } from '@prisma/client';
import { promises as fs } from 'fs';

export default async function createChatClient(currentTokenData: TwitchToken) {
  const authProvider = new RefreshingAuthProvider({
    clientId: process.env.TWITCH_CLIENT_ID!,
    clientSecret: process.env.TWITCH_CLIENT_SECRET!,
    onRefresh: async (userId, newTokenData) => {
      if (!newTokenData.refreshToken || !newTokenData.expiresIn) {
        throw new Error('Invalid refreshed token data');
      }

      await fs.writeFile('./src/tokenBot.json', JSON.stringify(newTokenData, null, 4), {
        encoding: 'utf-8'
      });
    }
  });

  const tokenData = JSON.parse(
    await fs.readFile('./src/tokenBot.json', {
      encoding: 'utf-8'
    })
  );
  await authProvider.addUserForToken(tokenData, ['chat']);

  return new ChatClient({
    authProvider,
    channels: [currentTokenData.userName],
    isAlwaysMod: true
  });
}
