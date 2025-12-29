import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
    <article className="flex flex-col">
      <header className="flex items-center justify-between text-sm">
        <Link
          href={`/u/${post.author}`}
          className="flex items-center gap-1 transition hover:bg-accent rounded-md p-1 -m-1"
        >
          <Avatar className="size-6">
            <AvatarImage src={post.authorImage} alt="글쓴이" />
            <AvatarFallback>{post.author.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs font-semibold">{post.author}</span>
        </Link>
        <time className="text-xs text-muted-foreground">{post.date}</time>
      </header>

      <Link href={`/u/${post.author}/${post.title}`} className="group" aria-label={`${post.title} 글 보기`}>
        <div className="flex mt-1">
          <div className="flex-1">
            <h2 className="sm:text-lg font-bold group-hover:underline">{post.title}</h2>
            <p className="line-clamp-3 text-sm text-muted-foreground">{post.description}</p>
          </div>
          <figure className="ml-2 sm:ml-4 relative h-26 w-22 shrink-0 overflow-hidden rounded-sm sm:h-30 sm:w-42 border shadow-lg">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="(max-width: 640px) 180px, 126px"
              className="object-cover transition-opacity group-hover:opacity-80"
            />
          </figure>
        </div>
      </Link>
      <footer className="flex justify-between">
        <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
          <button className="flex items-center gap-1 transition hover:bg-accent rounded-lg p-2 -m-2">
            <AiOutlineLike className="size-4" aria-hidden="true" />
            <span>{post.likes}</span>
          </button>
          <button className="flex items-center gap-1 transition hover:bg-accent rounded-lg p-2 -m-2">
            <IoStarOutline className="size-4" aria-hidden="true" />
            <span>{post.bookmarks}</span>
          </button>
          <div className="flex items-center gap-1">
            <IoChatbubbleOutline className="size-4" aria-hidden="true" />
            <span>{post.comments}</span>
          </div>
        </div>
      </footer>
    </article>
  );
};
export default PostItem;
