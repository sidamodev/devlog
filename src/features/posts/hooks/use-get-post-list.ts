'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { postKeys } from '../api/keys';
import { getPostList } from '../api/post-list-service';

export const useInfinitePostList = () => {
  return useInfiniteQuery({
    queryKey: postKeys.lists(),
    queryFn: getPostList,
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.pageInfo.nextCursor,
  });
};
