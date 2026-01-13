export type PaginatedResponse<T> = {
  data: T[];
  pageInfo: PageInfo;
};

export type PageInfo = {
  nextCursor: string | null;
  hasNextPage: boolean;
  count: number;
};
