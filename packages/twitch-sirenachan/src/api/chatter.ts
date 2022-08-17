import { prisma } from 'utils/database';

interface Chatter {
  channelId: string | null;
  userId: string;
  userName: string;
  messageId: string;
  message: string;
}

async function store(data: Chatter): Promise<{ chatterId: string }> {
  const chatter = await prisma.chatter.upsert({
    create: {
      channelId: data.channelId,
      userId: data.userId,
      userName: data.userName,
      messages: {
        create: {
          messageId: data.messageId,
          message: data.message
        }
      }
    },
    update: {
      messages: {
        create: {
          messageId: data.messageId,
          message: data.message
        }
      }
    },
    where: {
      // TODO: check the same chatter but on different channels
      userId: data.userId
    }
  });

  return {
    chatterId: chatter.id
  };
}

async function pickRandom(): Promise<{ userName: string }> {
  const chatterCount = await prisma.chatter.count();
  const skip = Math.max(0, Math.floor(Math.random() * chatterCount));

  const randomChatter = await prisma.chatter.findFirst({
    skip: skip
  });

  if (randomChatter) {
    return randomChatter;
  }

  return {
    userName: 'Не вийшло знайти користувача'
  };
}

export default {
  store,
  pickRandom
};
