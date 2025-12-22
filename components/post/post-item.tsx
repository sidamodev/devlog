import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { IoChatbubblesOutline, IoHeartOutline, IoThumbsUpOutline } from 'react-icons/io5';

type PostMockType = {
  id: string;
  title: string;
  date: string;
  link: string;
  image: string;
  description: string;
  tags: string[];
};

const PostItem = ({ post }: { post: PostMockType }) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-2 text-sm text-ring">
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <span className="text-xs">{post.date}</span>
      </div>
      <div className="flex">
        <div className="flex-1">
          <h1 className="text-lg sm:text-xl font-bold">{post.title}</h1>
          <p className="text-sm sm:text-base line-clamp-2">{post.description}</p>
        </div>
        <img src={post.image} alt={post.title} width={150} height={100} className="ml-4 rounded-md object-cover" />
      </div>
      <div className="mt-4 flex items-center text-sm text-ring">
        <IoThumbsUpOutline className="inline-block mr-1" />
        <span className="mr-2">10</span>
        <IoChatbubblesOutline className="inline-block mr-1" />
        <span className="mr-2">24</span>
      </div>
    </div>
  );
};
export default PostItem;
