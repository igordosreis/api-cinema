/* eslint-disable max-lines-per-function */
export default class VoucherCountSqlUtil {
  public static create(searchString: string) {
    return `SELECT
            COALESCE((SELECT COUNT(*)
              FROM vouchers_available AS a
              WHERE a.${searchString}
                AND expire_at > NOW()
                AND order_id IS NULL), 0) AS available,
  
            COALESCE((SELECT COUNT(*)
              FROM vouchers_user AS u
              WHERE u.${searchString}), 0) AS user,
  
            COALESCE((SELECT COUNT(*)
              FROM vouchers_withdraw AS w
              WHERE w.${searchString}), 0) AS withdraw,
  
            COALESCE((SELECT COUNT(*)
              FROM vouchers_available AS a
              WHERE a.${searchString}
                AND expire_at > NOW()
                AND order_id IS NULL), 0) +
            COALESCE((SELECT COUNT(*)
              FROM vouchers_user AS u
              WHERE u.${searchString}), 0) +
            COALESCE((SELECT COUNT(*)
              FROM vouchers_withdraw AS w
              WHERE w.${searchString}), 0) AS total`;
  }
}