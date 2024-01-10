import { IPaginationContent } from '../interfaces/IPagination';

export default class Pagination {
  static getPageContent<T>({ page, limit, array }: IPaginationContent<T>): Array<T> {
    const pageStart = page * limit;
    const pageEnd = (page + 1) * limit;

    const pageContent = array.slice(pageStart, pageEnd);

    return pageContent;
  }
}
