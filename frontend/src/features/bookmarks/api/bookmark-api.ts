import { BaseAPI } from '@/shared/lib/base-api';

export interface BookmarkedArticle {
  articleId: string;
  title: string;
  slug: string;
  subtitle: string;
  featuredImageUrl: string | null;
  readingTimeMinutes: number;
  bookmarkedAt: string;
  author: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl: string | null;
  };
}

export class BookmarkAPI extends BaseAPI {
  // Get all bookmarks for the current user
  async getUserBookmarks(): Promise<BookmarkedArticle[]> {
    return this.handleRequest(() =>
      this.axiosInstance.get<BookmarkedArticle[]>('/bookmarks')
    );
  }

  // Add a bookmark
  async addBookmark(articleId: string): Promise<void> {
    return this.handleRequest(() =>
      this.axiosInstance.post<void>(`/bookmarks/${articleId}`)
    );
  }

  // Remove a bookmark
  async removeBookmark(articleId: string): Promise<void> {
    return this.handleRequest(() =>
      this.axiosInstance.delete<void>(`/bookmarks/${articleId}`)
    );
  }
}

// Export singleton instance
export const bookmarkApi = new BookmarkAPI();
