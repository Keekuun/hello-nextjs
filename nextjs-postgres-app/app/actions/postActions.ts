'use server'; // 标记这个文件里的所有导出函数都是 Server Actions

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// 使用 Zod 定义输入数据的 schema
const PostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters long"),
  content: z.string().optional(),
});

export type CreatePostActionState = {
  message?: string;
  errors?: {
    title?: string[];
    content?: string[];
  };
};

export async function createPost(state: CreatePostActionState, formData: FormData) {
  const validatedFields = PostSchema.safeParse({
    title: formData.get('title'),
    content: formData.get('content'),
  });

  // 1. 服务端验证
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  // 2. 数据库操作
  try {
    await prisma.post.create({
      data: {
        title: validatedFields.data.title,
        content: validatedFields.data.content,
        authorId: 1, // 实际应用中应从用户会话中获取
      },
    });
  } catch (error: unknown) {
    console.error('Database error:', error);
    return { message: 'Database Error: Failed to Create Post.' };
  }

  // 3. 清除缓存并触发重新渲染
  // 当创建新文章后，通知 Next.js `/posts` 路径的数据已经过时，需要重新获取。
  revalidatePath('/posts');

  return { message: 'Successfully created post!' };
}
