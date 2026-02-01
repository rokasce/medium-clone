import z from 'zod';

// Custom preprocessor to handle both string and array formats from URL
const tagsArraySchema = z.preprocess((val) => {
  // If it's already an array, return it
  if (Array.isArray(val)) return val;
  // If it's undefined or null, return undefined
  if (val === undefined || val === null) return undefined;
  // If it's a single string, wrap in array
  if (typeof val === 'string') return [val];
  return undefined;
}, z.array(z.string()).optional());

export const searchSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(8),
  sortField: z.string().optional(), // e.g., 'publishedAt'
  sortDirection: z.enum(['Ascending', 'Descending']).optional(),
  searchTerm: z.string().optional(),
  tags: tagsArraySchema, // Array of tags from query string (e.g., ?tags=react&tags=typescript)
});

export type SearchParams = z.infer<typeof searchSchema>;
