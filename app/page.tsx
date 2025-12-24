import PostItem from '@/components/post/post-item';
import { Separator } from '@/components/ui/separator';
import { getPosts } from '@/lib/post';
import { Fragment } from 'react/jsx-runtime';

const MainPage = async () => {
  const posts = await getPosts();
  return (
    <div className="flex flex-col items-center justify-center max-w-md sm:max-w-xl w-full border py-4 px-4 rounded-3xl bg-background dark:bg-accent/60">
      <div>
        {posts.map((post, index) => (
          <Fragment key={post.id}>
            <PostItem post={post} />
            {index !== posts.length - 1 && <Separator className="my-4" />}
          </Fragment>
        ))}
      </div>
    </div>
  );
};
export default MainPage;
