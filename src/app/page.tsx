import PostItem from '@/components/post/post-item';
import { getPostList } from '@/api/post';

const MainPage = async () => {
  const posts = await getPostList();
  return (
    <section aria-label="Posts" className="w-full max-w-md sm:max-w-2xl">
      <ul className="flex flex-col rounded-3xl border bg-card sm:border-0 sm:bg-transparent p-4 sm:p-6">
        {posts.map((post, index) => (
          <li key={post.id}>
            <PostItem post={post} />
            {index !== posts.length - 1 && <div className="h-px bg-border/40 my-4" />}
          </li>
        ))}
      </ul>
    </section>
  );
};
export default MainPage;
