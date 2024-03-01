import { IPaginationContent } from '../interfaces/IPagination';

export default class PaginationUtil {
  static getPageContent<T>({ page = 0, limit = 20, array }: IPaginationContent<T>): Array<T> {
    const pageStart = page * limit;
    const pageEnd = (page + 1) * limit;

    const pageContent = array.slice(pageStart, pageEnd);

    return pageContent;
  }
}
