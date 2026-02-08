import { z } from 'zod';

export const tagSchema = z
  .string()
  .min(1, 'Tag cannot be empty')
  .max(30, 'Tag must be 30 characters or less')
  .regex(
    /^[a-z0-9-]+$/,
    'Tags can only contain lowercase letters, numbers, and hyphens'
  );

export const createArticleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(50, 'Content must be at least 50 characters'),
  subtitle: z.string().optional(),
  tags: z.array(tagSchema).max(5, 'Maximum 5 tags allowed').default([]),
});

export const updateArticleSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters').optional(),
  content: z
    .string()
    .min(50, 'Content must be at least 50 characters')
    .optional(),
  subtitle: z.string().optional(),
  tags: z.array(tagSchema).max(5, 'Maximum 5 tags allowed').default([]),
  featuredImage: z.string().url('Must be a valid URL').optional().nullable(),
});

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
