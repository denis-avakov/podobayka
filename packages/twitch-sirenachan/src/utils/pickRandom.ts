export default function pickRandom<T>(collection: Array<T>): T {
  return collection[Math.floor(Math.random() * collection.length)];
}
