export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  lastPage: number;
  hasMore: boolean;
};
