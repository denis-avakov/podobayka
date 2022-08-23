import { sample } from 'lodash';

interface ChatterProps {
  channelId: string | null;
  userId: string;
  userName: string;
  messageId: string;
  message: string;
}

class ChatterList extends Map<string, ChatterProps> {
  set(key: string, value: ChatterProps) {
    return super.set(key.toUpperCase(), value);
  }

  get(key: string) {
    return super.get(key.toUpperCase());
  }

  has(key: string) {
    return super.has(key.toUpperCase());
  }

  delete(key: string) {
    return super.delete(key.toUpperCase());
  }

  getPreviousMessage(userName: string) {
    return this.get(userName.toUpperCase())?.message;
  }

  getRandomUser() {
    if (!super.size) {
      return undefined;
    }

    const randomKey = sample([...super.keys()]);
    return this.get(randomKey as string);
  }

  getRandomUserName() {
    return this.getRandomUser()?.userName;
  }
}

const chatterList = new ChatterList();
export default chatterList;
