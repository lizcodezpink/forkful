export type User = {
  id: number;
  username: string;
  email: string;
  created_at: string;
};

export type Blog = {
  id: number;
  owner_id: number;
  slug: string;
  title: string;
  description: string;
  created_at: string;
};

export type Post = {
  id: number;
  blog_id: number;
  author_name: string;
  title: string;
  body: string;
  hidden: number;
  created_at: string;
};

export type BlogWithOwner = Blog & {
  owner_username: string;
  post_count: number;
};
