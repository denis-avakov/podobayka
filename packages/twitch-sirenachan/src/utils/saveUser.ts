import { union } from 'lodash';
import storage from 'utils/storage';

export default function saveUser(currentUser: string) {
  const ignoreList = ['sirena_chan', 'sirenachanbot', 'fossabot', 'rewardtts', 'donationalertsbot'];

  if (ignoreList.includes(currentUser)) {
    return;
  }

  const users = storage.getData('/users') || [];
  storage.push('/users', union([...users, currentUser]));
}
