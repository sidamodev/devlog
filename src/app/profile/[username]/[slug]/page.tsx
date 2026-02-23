import { BlockRenderer } from '@/components/block-renderer/block-renderer';
import { getPostDetail } from '@/features/posts/server/service';
import PostContent from '@/features/posts/ui/post-content';
import PostFooter from '@/features/posts/ui/post-footer';
import PostHeader from '@/features/posts/ui/post-header';
import PostProgressBar from '@/features/posts/ui/post-progress-bar';
import { notFound } from 'next/navigation';

export const revalidate = false;

const PostDetailPage = async ({ params }: { params: Promise<{ username: string; slug: string }> }) => {
  const { slug } = await params;
  const post = await getPostDetail(slug);
  if (!post) {
    notFound();
  }
  const { body, ...headerProps } = post;

  return (
    <article className="mx-0 flex w-full min-w-0 flex-col md:max-w-3xl">
      <PostProgressBar />
      <PostHeader {...headerProps} />
      <PostContent>
        <BlockRenderer blocks={body} />
      </PostContent>
      <PostFooter />
    </article>
  );
};

export default PostDetailPage;
