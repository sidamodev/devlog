'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getPostList } from './post-list.api';
import { postKeys } from './post-query-keys';

export const useInfinitePostList = () => {
  return useInfiniteQuery({
    queryKey: postKeys.lists(),
    queryFn: getPostList,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.pageInfo.nextCursor,
  });
};
