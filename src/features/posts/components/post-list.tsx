'use client';
import PostListItem from '@/features/posts/components/post-list-item';
import useIntersectionObserver from '@/hooks/useIntersectionObserver';
import { LuLoader } from 'react-icons/lu';
import { useInfinitePostList } from '../hooks/use-get-post-list';

const PostList = () => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfinitePostList();

  const handleIntersection = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const observerRef = useIntersectionObserver<HTMLDivElement>(handleIntersection);

  return (
    <ul className="flex flex-col rounded-3xl border bg-card sm:border-0 sm:bg-transparent p-4 sm:p-6 divide-y divide-border/40">
      {data?.pages.flatMap((page) =>
        page.data.map((post) => (
          <li key={post.id} className="py-4">
            <PostListItem post={post} />
          </li>
        )),
      )}
      <div ref={observerRef} className="flex min-h-5 items-center justify-center py-4">
        {isFetchingNextPage && <LuLoader className="h-6 w-6 animate-spin text-muted-foreground" />}
      </div>
    </ul>
  );
};

export default PostList;
