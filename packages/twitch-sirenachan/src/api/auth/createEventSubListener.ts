import { EventSubListener, EnvPortAdapter } from '@twurple/eventsub';
import { NgrokAdapter } from '@twurple/eventsub-ngrok';
import type { ApiClient } from '@twurple/api';

export default async function createEventSubListener(apiClient: ApiClient) {
  if (!process.env.TWURPLE_EVENTSUB_HOSTNAME || !process.env.TWURPLE_EVENTSUB_SECRET) {
    throw new Error(
      'Missing TWURPLE_EVENTSUB_HOSTNAME or TWURPLE_EVENTSUB_SECRET environment variables'
    );
  }

  // This is necessary to prevent conflict errors resulting
  // from ngrok assigning a new host name every time
  await apiClient.eventSub.deleteAllSubscriptions();

  return new EventSubListener({
    adapter:
      process.env.RAILWAY_ENVIRONMENT !== 'production'
        ? new NgrokAdapter()
        : new EnvPortAdapter({ hostName: process.env.TWURPLE_EVENTSUB_HOSTNAME }),
    apiClient,
    secret: process.env.TWURPLE_EVENTSUB_SECRET,
    strictHostCheck: true
  });
}
