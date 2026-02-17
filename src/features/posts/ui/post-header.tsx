import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { PostDetail } from '@/features/posts/shared/post.types';
import { LuClock } from 'react-icons/lu';

type PostHeaderProps = Omit<PostDetail, 'body'> & {
  tags?: string[];
};

const PostHeader = ({ title, description, author, createdAt, readingTime, tags }: PostHeaderProps) => {
  return (
    <header className="mb-8">
      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant="secondary"
              className="text-xs font-sans font-medium tracking-wide uppercase hover:bg-secondary/80 cursor-pointer"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl lg:text-4xl font-bold tracking-tight leading-tight text-foreground mb-4 text-balance">
        {title}
      </h1>

      {/*  */}
      {description && <p className="sm:text-lg text-muted-foreground leading-relaxed mb-4">{description}</p>}

      {/* Author Info */}
      <div className="flex items-center gap-2 pt-6 border-t border-border">
        <Avatar className="h-10 w-10">
          <AvatarImage src={author.avatar} alt={author.nickname} />
          <AvatarFallback className="font-sans text-sm">{author.nickname.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col">
          <span className="font-sans font-medium text-foreground text-sm">{author.nickname}</span>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <time dateTime={createdAt}>{createdAt}</time>
            <span>·</span>
            <span className="flex items-center gap-0.5">
              <LuClock />
              <span className="tracking-tighter">{readingTime}분 소요</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PostHeader;
