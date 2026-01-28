import { POST_DETAIL_002 } from '@/mocks/fixtures/post-002';
import PostDetailContent from './_components/post-detail-content';
import PostDetailHeader from './_components/post-detail-header';

const PostDetailPage = async ({ params }: { params: Promise<{ username: string; slug: string }> }) => {
  const { username, slug } = await params;
  const post = POST_DETAIL_002;

  return (
    <article className="flex flex-col max-w-sm sm:max-w-md md:max-w-3xl">
      <PostDetailHeader {...post} />
      <PostDetailContent content={post.content} />
    </article>
  );
};

export default PostDetailPage;
