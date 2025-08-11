import { prisma } from '@/lib/prisma';
import { cache } from 'react';
import {CreatePostForm} from "@/app/posts/CreatePostForm";

// Next.js 会自动对 fetch 请求进行缓存，但对数据库查询不会。
// 使用 `cache` 函数可以手动实现类似功能，避免在一次渲染中重复查询相同数据。
const getPosts = cache(async () => {
  console.log('Fetching posts from database...');
  const posts = await prisma.post.findMany({
    where: { published: true },
    include: { author: true },
  });
  return posts;
});

export default async function PostsPage() {
  const posts = await getPosts();

  // 注意这里的类型安全！
  // `post` 的类型是 (Post & { author: User })[]，由 Prisma 自动推断

  return (
    <div>
      <h1>Published Posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>By {post.author.name ?? 'Unknown'}</p>
          </li>
        ))}
      </ul>
      <CreatePostForm />
    </div>
  );
}
