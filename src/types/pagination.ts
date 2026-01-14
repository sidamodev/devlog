export type PaginatedResponse<T> = {
  data: T[];
  pageInfo: PageInfo;
};

export type PageInfo = {
  nextCursor?: string;
  hasNextPage: boolean;
  count: number;
};
