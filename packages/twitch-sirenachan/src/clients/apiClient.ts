import { StaticAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';

export default function createApiClient() {
  const authProvider = new StaticAuthProvider(
    process.env.TWITCH_CLIENT_ID as string,
    process.env.TWITCH_CLIENT_SECRET as string
  );

  return new ApiClient({ authProvider });
}
