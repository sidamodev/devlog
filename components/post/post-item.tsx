import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { AiOutlineLike } from 'react-icons/ai';
import { IoChatbubbleOutline, IoStarOutline } from 'react-icons/io5';

type PostType = {
  id: string;
  title: string;
  author: string;
  authorImage: string;
  date: string;
  image: string;
  description: string;
  likes: number;
  comments: number;
  bookmarks: number;
};

const PostItem = ({ post }: { post: PostType }) => {
  return (
    <article className="flex flex-col group">
      {/* Header: Author & Date */}
      <header className="flex items-center gap-2 text-sm mb-3">
        <Link href={`/u/${post.author}`} className="flex items-center gap-2 hover:underline">
          <Avatar className="size-6 border">
            <AvatarImage src={post.authorImage} alt={post.author} />
            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-foreground">{post.author}</span>
        </Link>
        <span className="text-muted-foreground">·</span>
        <time className="text-xs text-muted-foreground">{post.date}</time>
      </header>

      {/* Body: Title, Desc, Image */}
      <Link href={`/u/${post.author}/${post.title}`} className="block" aria-label={`${post.title} 글 보기`}>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Text Content */}
          <div className="flex-1 order-2 sm:order-1 flex flex-col justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold group-hover:underline decoration-2 underline-offset-4 leading-tight">
                {post.title}
              </h2>
              <p className="line-clamp-2 sm:line-clamp-3 text-sm text-muted-foreground mt-2 leading-relaxed">
                {post.description}
              </p>
            </div>
          </div>

          {/* Image */}
          <figure className="order-1 sm:order-2 relative w-full sm:w-[140px] aspect-video sm:aspect-square shrink-0 overflow-hidden rounded-md border bg-muted">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 100vw, 140px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </figure>
        </div>
      </Link>

      {/* Footer: Actions */}
      <footer className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-0.5 -ml-2">
          <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground gap-1.5">
            <AiOutlineLike className="size-4" aria-hidden="true" />
            <span className="text-xs font-medium">{post.likes}</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground gap-1.5">
            <IoChatbubbleOutline className="size-4" aria-hidden="true" />
            <span className="text-xs font-medium">{post.comments}</span>
          </Button>
          <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-foreground gap-1.5">
            <IoStarOutline className="size-4" aria-hidden="true" />
            <span className="text-xs font-medium">{post.bookmarks}</span>
          </Button>
        </div>
      </footer>
    </article>
  );
};
export default PostItem;
