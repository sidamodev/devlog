'use client';
import { useInfinitePostList } from '@/features/posts/client/use-infinite-post-list';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { LuLoader } from 'react-icons/lu';
import PostListItem from './post-list-item';

const PostList = () => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfinitePostList();

  const handleIntersection = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const sentinelRef = useIntersectionObserver<HTMLLIElement>(handleIntersection);

  return (
    <ul className="flex flex-col rounded-3xl border bg-card sm:border-0 sm:bg-transparent p-4 sm:p-6 divide-y divide-border/40">
      {data?.pages.flatMap((page) =>
        page.data.map((post) => (
          <li key={post.id} className="py-4">
            <PostListItem post={post} />
          </li>
        )),
      )}
      <li ref={sentinelRef} className="flex min-h-5 items-center justify-center py-4">
        {hasNextPage && <LuLoader className="h-6 w-6 animate-spin text-muted-foreground" />}
      </li>
    </ul>
  );
};

export default PostList;
