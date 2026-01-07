export type PostList = Post[];

export type Post = {
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
