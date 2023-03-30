import { prisma } from 'utils/database';

async function get(name: string) {
  const user = await prisma.user.findFirst({
    where: {
      displayName: name
    }
  });

  // @todo: try-catche
  if (!user) {
    // throw new Error(`Missing user (${userName}) in database`);
  }

  return user;
}

export default {
  get
};
