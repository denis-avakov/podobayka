import { prisma } from 'utils/database';

async function get(userName: string) {
  const user = await prisma.user.findFirst({
    where: {
      displayName: userName
    }
  });

  if (!user) {
    throw new Error(`Missing user (${userName}) in database`);
  }

  return user;
}

export default {
  get
};
