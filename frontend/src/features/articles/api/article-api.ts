import { BaseAPI } from '@/shared/lib/base-api';
import type {
  CreateArticleRequest,
  PagedResult,
  UpdateArticleRequest,
} from '@/shared/types/api';
import type { Article, ArticleSummary } from '@/types';

export class ArticleAPI extends BaseAPI {
  // Get paginated list of published articles
  async getPublished(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    tagId?: string;
    sortBy?: string;
  }): Promise<PagedResult<ArticleSummary>> {
    return this.handleRequest(() =>
      this.axiosInstance.get<PagedResult<ArticleSummary>>('/articles', {
        params,
      })
    );
  }

  // Get published article by slug (public)
  async getBySlug(slug: string): Promise<Article> {
    return this.handleRequest(() =>
      this.axiosInstance.get<Article>(`/articles/${slug}`)
    );
  }

  // Preview article by slug (for author - includes drafts)
  async previewBySlug(slug: string): Promise<Article> {
    return this.handleRequest(() =>
      this.axiosInstance.get<Article>(`/articles/preview/${slug}`)
    );
  }

  // Get current user's articles (drafts and published)
  async getMyDrafts(params?: {
    page?: number;
    pageSize?: number;
  }): Promise<ArticleSummary[]> {
    return this.handleRequest(() =>
      this.axiosInstance.get<ArticleSummary[]>('/articles/my', {
        params,
      })
    );
  }

  // Get articles by author
  async getByAuthor(
    authorId: string,
    params?: { page?: number; pageSize?: number }
  ): Promise<PagedResult<ArticleSummary>> {
    return this.handleRequest(() =>
      this.axiosInstance.get<PagedResult<ArticleSummary>>(
        `/articles/author/${authorId}`,
        { params }
      )
    );
  }

  // Get feed (articles from followed authors)
  async getFeed(params?: {
    page?: number;
    pageSize?: number;
  }): Promise<PagedResult<ArticleSummary>> {
    return this.handleRequest(() =>
      this.axiosInstance.get<PagedResult<ArticleSummary>>('/articles/feed', {
        params,
      })
    );
  }

  // Create a new draft
  async createDraft(data: CreateArticleRequest): Promise<Article> {
    return this.handleRequest(() =>
      this.axiosInstance.post<Article>('/articles/drafts', data)
    );
  }

  // Update an article
  async update(id: string, data: UpdateArticleRequest): Promise<Article> {
    return this.handleRequest(() =>
      this.axiosInstance.put<Article>(`/articles/${id}`, data)
    );
  }

  // Publish an article
  async publish(id: string): Promise<Article> {
    return this.handleRequest(() =>
      this.axiosInstance.post<Article>(`/articles/${id}/publish`)
    );
  }

  // Unpublish an article
  async unpublish(id: string): Promise<Article> {
    return this.handleRequest(() =>
      this.axiosInstance.post<Article>(`/articles/${id}/unpublish`)
    );
  }

  // Delete an article
  async delete(id: string): Promise<void> {
    return this.handleRequest(() =>
      this.axiosInstance.delete<void>(`/articles/${id}`)
    );
  }

  // Clap for an article
  async clap(id: string, count: number = 1): Promise<{ clapCount: number }> {
    return this.handleRequest(() =>
      this.axiosInstance.post<{ clapCount: number }>(`/articles/${id}/claps`, {
        count,
      })
    );
  }

  // Bookmark an article
  async bookmark(id: string): Promise<void> {
    return this.handleRequest(() =>
      this.axiosInstance.post<void>(`/articles/${id}/bookmark`)
    );
  }

  // Remove bookmark
  async removeBookmark(id: string): Promise<void> {
    return this.handleRequest(() =>
      this.axiosInstance.delete<void>(`/articles/${id}/bookmark`)
    );
  }
}

export const articleApi = new ArticleAPI();
