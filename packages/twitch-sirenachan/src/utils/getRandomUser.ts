import { random, sample } from 'lodash';
import storage from 'utils/storage';

export default function getRandomUser() {
  const users = storage.getData('/users') || [];

  if (random(0, 100) < 10) {
    return 'sirena_chan';
  }

  return sample(users);
}
