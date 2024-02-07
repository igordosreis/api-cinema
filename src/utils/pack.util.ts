export default class PackUtil {
  public static setupLimit(counterLimit: number | undefined) {
    const isLimited = counterLimit;
    if (isLimited) {
      return {
        limited: true,
        counterLimit,
        counter: 0,
      };
    }
    return {};
  }
}
