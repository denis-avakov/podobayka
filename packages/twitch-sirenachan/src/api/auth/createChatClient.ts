import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';
import { prisma } from 'utils/database';
import { CHANNEL } from 'utils/vars';

export default async function createChatClient() {
  if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
    throw new Error('Missing TWITCH_CLIENT_ID or TWITCH_CLIENT_SECRET environment variables');
  }

  const currentTokenData = await prisma.twitchToken.findFirst({
    where: {
      name: CHANNEL.name
    }
  });

  if (!currentTokenData) {
    throw new Error('Missing Twitch token in database');
  }

  const authProvider = new RefreshingAuthProvider(
    {
      clientId: process.env.TWITCH_CLIENT_ID,
      clientSecret: process.env.TWITCH_CLIENT_SECRET,
      onRefresh: async (newTokenData) => {
        if (!newTokenData.refreshToken || !newTokenData.expiresIn) {
          throw new Error('Invalid refreshed token data');
        }

        await prisma.twitchToken.update({
          where: {
            id: currentTokenData.id
          },
          data: {
            accessToken: newTokenData.accessToken,
            expiresIn: newTokenData.expiresIn,
            obtainmentTimestamp: newTokenData.obtainmentTimestamp,
            refreshToken: newTokenData.refreshToken,
            scope: JSON.stringify(newTokenData.scope)
          }
        });
      }
    },
    {
      accessToken: currentTokenData.accessToken,
      expiresIn: currentTokenData.expiresIn,
      obtainmentTimestamp: Number(currentTokenData.obtainmentTimestamp),
      refreshToken: currentTokenData.refreshToken,
      scope: JSON.parse(currentTokenData.scope)
    }
  );

  return new ChatClient({
    authProvider,
    channels: [currentTokenData.name],
    isAlwaysMod: true
  });
}
