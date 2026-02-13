import { BlockRenderer } from '@/components/block-renderer/block-renderer';
import { getPostDetail } from '@/features/posts/server/service';
import PostContent from '@/features/posts/ui/post-content';
import PostFooter from '@/features/posts/ui/post-footer';
import PostHeader from '@/features/posts/ui/post-header';
import { notFound } from 'next/navigation';

const PostDetailPage = async ({ params }: { params: Promise<{ username: string; slug: string }> }) => {
  const { slug } = await params;
  const post = await getPostDetail(slug);
  if (!post) {
    notFound();
  }

  return (
    <article className="flex flex-col min-w-0 md:max-w-3xl mx-0">
      <PostHeader {...post} />
      <PostContent>
        <BlockRenderer blocks={post.body} />
      </PostContent>
      <PostFooter />
    </article>
  );
};

export default PostDetailPage;
