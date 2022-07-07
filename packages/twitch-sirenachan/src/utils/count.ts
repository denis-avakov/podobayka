import storage from 'utils/storage';

export default function count(id: string) {
  const amount = storage.getData(`/counters/${id}`);
  storage.push(`/counters/${id}`, amount + 1);

  return amount + 1;
}
