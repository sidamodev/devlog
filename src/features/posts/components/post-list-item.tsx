import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PostSummary } from '@/features/posts/api/types';
import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineLike } from 'react-icons/ai';
import { IoChatbubbleOutline, IoStarOutline } from 'react-icons/io5';

const PostListItem = ({ post }: { post: PostSummary }) => {
  return (
    <article className="flex flex-col">
      <header className="flex items-center gap-2 text-sm mb-2">
        <Link href={`/@${post.author.username}`} className="flex items-center gap-1 hover:underline">
          <Avatar className="size-5 sm:size-6">
            <AvatarImage src={post.author.avatar} />
            <AvatarFallback>{post.author.nickname.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium tracking-tight text-foreground">{post.author.nickname}</span>
        </Link>
        <span className="text-muted-foreground">·</span>
        <time className="text-xs text-muted-foreground">{post.createdAt}</time>
      </header>

      <Link href={`/@${post.author.username}/${post.slug}`} className="group" aria-label={`${post.title} 글 보기`}>
        <div className="flex mt-1">
          <div className="flex-1">
            <h2 className="sm:text-lg font-bold group-hover:underline">{post.title}</h2>
            <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">{post.description}</p>
          </div>

          <figure className="ml-2 sm:ml-4 relative h-26 w-22 shrink-0 overflow-hidden rounded-sm sm:h-30 sm:w-42 border shadow-lg">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 180px, 126px"
              className="object-cover transition-opacity group-hover:opacity-80"
            />
          </figure>
        </div>
      </Link>

      <footer className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-0.5 -ml-2">
          <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground gap-1">
            <AiOutlineLike className="size-4" aria-hidden="true" />
            <span className="text-xs font-medium">{post.likeCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground gap-1">
            <IoChatbubbleOutline className="size-4" aria-hidden="true" />
            <span className="text-xs font-medium">{post.commentCount}</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground gap-1">
            <IoStarOutline className="size-4" aria-hidden="true" />
            <span className="text-xs font-medium">{post.bookmarkCount}</span>
          </Button>
        </div>
      </footer>
    </article>
  );
};
export default PostListItem;
