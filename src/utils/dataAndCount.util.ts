export default class DataAndCountUtil {
  public static getObject<T>(count: number, rows: T[]) {
    const obj = {
      total: count,
      data: rows,
    };

    return obj;
  }
}