import { RefreshingAuthProvider, ClientCredentialsAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { ChatClient } from '@twurple/chat';
import { EventSubListener } from '@twurple/eventsub';
import { NgrokAdapter } from '@twurple/eventsub-ngrok';
import storage from 'utils/storage';

async function getChatClient() {
  const authProvider = new RefreshingAuthProvider(
    {
      clientId: process.env.TWITCH_CLIENT_ID as string,
      clientSecret: process.env.TWITCH_CLIENT_SECRET as string,
      onRefresh: async (newTokenData) => storage.push('/token', newTokenData)
    },
    await storage.getData('/token')
  );

  return new ChatClient({
    authProvider,
    channels: ['sirena_chan'],
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
