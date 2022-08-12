import { union } from 'lodash';
import storage from 'utils/storage';

export default async function saveUser(currentUser: string) {
  const ignoreList = ['sirena_chan', 'sirenachanbot', 'fossabot', 'rewardtts', 'donationalertsbot'];

  if (ignoreList.includes(currentUser)) {
    return;
  }

  const users = await storage.getData('/users');
  await storage.push('/users', union([...users, currentUser]));
}
