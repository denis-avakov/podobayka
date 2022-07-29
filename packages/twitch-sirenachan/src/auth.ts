import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';
import storage from 'utils/storage';

export default async function auth() {
  if (!process.env.TWITCH_CLIENT_ID || !process.env.TWITCH_CLIENT_SECRET) {
    throw new Error('TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET must be set');
  }

  const authProvider = new RefreshingAuthProvider(
    {
      clientId: process.env.TWITCH_CLIENT_ID as string,
      clientSecret: process.env.TWITCH_CLIENT_SECRET as string,
      onRefresh: async (newTokenData) => storage.push('/token', newTokenData)
    },
    storage.getData('/token')
  );

  return new ChatClient({
    authProvider,
    channels: ['sirena_chan'],
    isAlwaysMod: true
  });
}
