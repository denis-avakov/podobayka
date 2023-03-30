interface CounterProps {}

class CounterList extends Map<string, CounterProps> {
  increase() {
    // @todo
  }

  decrease() {
    // @todo
  }

  get() {
    return super.get('');
  }

  set(key: string, value: number) {
    return super.set(key, Number(value));
  }

  reset() {
    // @todo
  }

  sync() {
    // @todo
  }
}

const counterList = new CounterList();
export default counterList;
