import { RefreshingAuthProvider } from '@twurple/auth';
import { EventSubWsListener } from '@twurple/eventsub-ws';
import { ApiClient } from '@twurple/api';
import { promises as fs } from 'fs';

export default async function createEventSubListener() {
  const broadcasterAuthProvider = new RefreshingAuthProvider({
    clientId: process.env.TWITCH_CLIENT_ID!,
    clientSecret: process.env.TWITCH_CLIENT_SECRET!,
    onRefresh: async (userId, newTokenData) => {
      if (!newTokenData.refreshToken || !newTokenData.expiresIn) {
        throw new Error('Invalid refreshed token data');
      }

      await fs.writeFile('./src/tokenBroadcaster.json', JSON.stringify(newTokenData, null, 4), {
        encoding: 'utf-8'
      });
    }
  });

  const tokenData = JSON.parse(
    await fs.readFile('./src/tokenBroadcaster.json', {
      encoding: 'utf-8'
    })
  );
  await broadcasterAuthProvider.addUserForToken(tokenData);

  const broadcasterApiClient = new ApiClient({
    authProvider: broadcasterAuthProvider
  });

  await broadcasterApiClient.eventSub.deleteAllSubscriptions();

  return new EventSubWsListener({
    apiClient: broadcasterApiClient,
    logger: {
      minLevel: 'trace',
      custom: (level, message) => {
        console.log(`EVENTSUB-WS[${level}]: ${message}`);
      }
    }
  });

  // This is necessary to prevent conflict errors resulting
  // from ngrok assigning a new host name every time
  // await apiClient.eventSub.deleteAllSubscriptions();

  // return new EventSubListener({
  //   adapter: new EnvPortAdapter({ hostName: process.env.TWURPLE_EVENTSUB_HOSTNAME }),
  //   apiClient,
  //   secret: process.env.TWURPLE_EVENTSUB_SECRET,
  //   strictHostCheck: true
  // });
}
