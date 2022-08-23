import { prisma } from 'utils/database';

async function get(userId: string) {
  const twitchToken = await prisma.twitchToken.findFirst({
    where: {
      ownerId: userId
    }
  });

  if (!twitchToken) {
    throw new Error('Missing Twitch token in database');
  }

  return twitchToken;
}

export default {
  get
};
