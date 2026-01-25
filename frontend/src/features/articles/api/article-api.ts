import { apiClient } from '@/lib/api-client';
import type {
  Article,
  ArticleSummary,
  PagedResult,
  ArticleFilterParams,
} from '@/types';
import type {
  CreateArticleInput,
  UpdateArticleInput,
} from '../schemas/article-schemas';

export const ArticleApi = {
  // Get paginated list of published articles
  getPublished: async (
    params?: ArticleFilterParams
  ): Promise<PagedResult<ArticleSummary>> => {
    const response = await apiClient.get('/api/articles', { params });
    return response.data;
  },

  // Get single article by slug
  getBySlug: async (slug: string): Promise<Article> => {
    const response = await apiClient.get(`/api/articles/${slug}`);
    return response.data;
  },

  // Get current user's drafts
  getMyDrafts: async (
    params?: ArticleFilterParams
  ): Promise<PagedResult<ArticleSummary>> => {
    const response = await apiClient.get('/api/articles/drafts', { params });
    return response.data;
  },

  // Get articles by author
  getByAuthor: async (
    authorId: string,
    params?: ArticleFilterParams
  ): Promise<PagedResult<ArticleSummary>> => {
    const response = await apiClient.get(`/api/articles/author/${authorId}`, {
      params,
    });
    return response.data;
  },

  // Get feed (articles from followed authors)
  getFeed: async (
    params?: ArticleFilterParams
  ): Promise<PagedResult<ArticleSummary>> => {
    const response = await apiClient.get('/api/articles/feed', { params });
    return response.data;
  },

  // Create a new draft
  createDraft: async (data: CreateArticleInput): Promise<Article> => {
    const response = await apiClient.post('/api/articles/drafts', data);
    return response.data;
  },

  // Update an article
  update: async (id: string, data: UpdateArticleInput): Promise<Article> => {
    const response = await apiClient.put(`/api/articles/${id}`, data);
    return response.data;
  },

  // Publish an article
  publish: async (id: string): Promise<Article> => {
    const response = await apiClient.post(`/api/articles/${id}/publish`);
    return response.data;
  },

  // Unpublish an article
  unpublish: async (id: string): Promise<Article> => {
    const response = await apiClient.post(`/api/articles/${id}/unpublish`);
    return response.data;
  },

  // Delete an article
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/articles/${id}`);
  },

  // Clap for an article
  clap: async (id: string): Promise<{ clapsCount: number }> => {
    const response = await apiClient.post(`/api/articles/${id}/clap`);
    return response.data;
  },

  // Bookmark an article
  bookmark: async (id: string): Promise<void> => {
    await apiClient.post(`/api/articles/${id}/bookmark`);
  },

  // Remove bookmark
  removeBookmark: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/articles/${id}/bookmark`);
  },
};
