export interface IPaginationContent<T> {
  page: number;
  limit: number;
  array: Array<T>;
}
