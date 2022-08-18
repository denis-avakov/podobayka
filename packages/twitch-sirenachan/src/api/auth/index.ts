import createApiClient from 'api/auth/createApiClient';
import createEventSubListener from 'api/auth/createEventSubListener';
import createChatClient from 'api/auth/createChatClient';

export default async function initAuth() {
  const apiClient = createApiClient();
  const chatClient = await createChatClient();
  const eventSubListener = await createEventSubListener(apiClient);

  return {
    apiClient,
    chatClient,
    eventSubListener
  };
}
