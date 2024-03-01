export interface IPaginationContent<T> {
  page: number | undefined;
  limit: number | undefined;
  array: Array<T>;
}

// export type IPaginationRequest = {
//   page: number;
//   limit: number;
// };

export interface IPaginationRequest {
  page?: string;
  limit?: string;
}

export interface IPagination {
  page: number;
  limit: number;
}
