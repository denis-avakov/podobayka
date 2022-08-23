class ModeratorList extends Map<string, string> {
  set(key: string) {
    return super.set(key.toUpperCase(), key);
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

  getList() {
    return [...super.values()];
  }
}

const moderatorList = new ModeratorList();
export default moderatorList;
