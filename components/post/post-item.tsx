import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import { IoChatbubbleOutline, IoStarOutline, IoThumbsUpOutline } from 'react-icons/io5';

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
};

const PostItem = ({ post }: { post: PostType }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Avatar className="size-6">
            <AvatarImage src={post.authorImage} alt="글쓴이" />
            <AvatarFallback>dl</AvatarFallback>
          </Avatar>
          <span className="font-bold">{post.author}</span>
        </div>
        <span className="text-xs text-ring">{post.date}</span>
      </div>
      <div className="flex mt-1">
        <div className="flex-1">
          <h1 className="text-md sm:text-lg font-bold">{post.title}</h1>
          <p className="text-sm text-ellipsis">{post.description}</p>
        </div>
        <Image src={post.image} alt={post.title} width={150} height={100} className="ml-4 rounded-md object-cover" />
      </div>
      <div className="mt-2 flex items-center text-xs text-ring">
        <IoThumbsUpOutline className="size-4 mr-1" />
        <span className="mr-4">{post.likes}</span>
        <IoChatbubbleOutline className="size-4 mr-1" />
        <span className="mr-4">{post.comments}</span>
        <IoStarOutline className="size-4" />
      </div>
    </div>
  );
};
export default PostItem;
