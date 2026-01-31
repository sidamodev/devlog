import { cn } from '@/lib/utils';

type PostDetailContentProps = {
  children: React.ReactNode;
  className?: string;
};

const PostContent = async ({ children, className }: PostDetailContentProps) => (
  <div
    className={cn(
      'prose dark:prose-invert max-w-none',
      'prose-headings:prose-headings:font-bold prose-headings:tracking-tight',
      'prose-p:leading-relaxed prose-p:mb-8 prose-p:text-foreground/90',
      'prose-blockquote:font-serif prose-blockquote:border-l-4 prose-blockquote:border-primary/50 prose-blockquote:pl-6 prose-blockquote:my-8 prose-blockquote:italic prose-blockquote:bg-muted/30 prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg',
      'prose-ul:list-disc prose-ul:pl-6 prose-ul:my-6 prose-li:prose-li:text-xl prose-li:leading-relaxed prose-li:mb-2',
      'prose-ol:list-decimal prose-ol:pl-6 prose-ol:my-6',
      'prose-a:text-primary prose-a:underline prose-a:underline-offset-4 hover:prose-a:text-primary/80',
      'prose-img:rounded-xl prose-img:shadow-lg',
      'prose-hr:my-12 prose-hr:border-border',
      'prose-code:font-mono prose-code:before:content-none prose-code:after:content-none',
      className,
    )}
  >
    {children}
  </div>
);
export default PostContent;
