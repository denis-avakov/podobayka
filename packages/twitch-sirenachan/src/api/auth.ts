import { RefreshingAuthProvider, ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { ChatClient } from '@twurple/chat';
import { EventSubListener } from '@twurple/eventsub';
import { NgrokAdapter } from '@twurple/eventsub-ngrok';
import { prisma } from 'utils/database';
import { CHANNEL } from 'utils/vars';

async function getChatClient() {
  const currentTokenData = await prisma.twitchToken.findFirst({
    where: {
      name: CHANNEL.name
    }
  });

  if (!currentTokenData) {
    throw new Error('No connection to the database');
  }

  const authProvider = new RefreshingAuthProvider(
    {
      clientId: process.env.TWITCH_CLIENT_ID as string,
      clientSecret: process.env.TWITCH_CLIENT_SECRET as string,
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
    channels: [CHANNEL.name],
    isAlwaysMod: true
  });
}

async function getEventSubListener() {
  const authProvider = new ClientCredentialsAuthProvider(
    process.env.TWITCH_CLIENT_ID as string,
    process.env.TWITCH_CLIENT_SECRET as string
  );
  const apiClient = new ApiClient({ authProvider });

  // This is necessary to prevent conflict errors resulting
  // from ngrok assigning a new host name every time
  await apiClient.eventSub.deleteAllSubscriptions();

  return new EventSubListener({
    apiClient,
    adapter: new NgrokAdapter(),
    secret: 'DxNP9hf8nhn66Jf6',
    strictHostCheck: true
  });
}

export default {
  getChatClient,
  getEventSubListener
};
