import { BlockRenderer } from '@/components/block-renderer/block-renderer';
import PostContent from '@/features/posts/components/post-content';
import PostHeader from '@/features/posts/components/post-header';
import { POST_DETAIL_002 } from '@/mocks/fixtures/post-002';
import { Block } from '@blocknote/core';

const PostDetailPage = async ({ params }: { params: Promise<{ username: string; slug: string }> }) => {
  const { username, slug } = await params;
  const post = POST_DETAIL_002;

  return (
    <article className="flex flex-col min-w-0 sm:max-w-md md:max-w-3xl mx-0">
      <PostHeader {...post} />
      <PostContent>
        <BlockRenderer blocks={post.content as Block[]} />
      </PostContent>
    </article>
  );
};

export default PostDetailPage;
