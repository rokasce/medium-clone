import { z } from 'zod';

export const createArticleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  subtitle: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export const updateArticleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').optional(),
  content: z
    .string()
    .min(50, 'Content must be at least 50 characters')
    .optional(),
  subtitle: z.string().optional(),
  tags: z.array(z.string()).optional(),
  featuredImage: z.string().url('Must be a valid URL').optional().nullable(),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
