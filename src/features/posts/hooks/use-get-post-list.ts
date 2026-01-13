'use client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { postKeys } from '../api/keys';
import { getPostList } from '../api/service';

export const useInfinitePostList = () => {
  return useInfiniteQuery({
    queryKey: postKeys.lists(),
    queryFn: getPostList,
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.pageInfo.nextCursor,
  });
};
