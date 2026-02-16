import type { ArticleFilterParams, PaginationParams } from '@/types';

export const queryKeys = {
  articles: {
    all: ['articles'] as const,
    list: (params?: ArticleFilterParams) =>
      [...queryKeys.articles.all, 'list', params] as const,
    detail: (slug: string) =>
      [...queryKeys.articles.all, 'detail', slug] as const,
    byAuthor: (authorId: string) =>
      [...queryKeys.articles.all, 'author', authorId] as const,
    feed: (params?: ArticleFilterParams) =>
      [...queryKeys.articles.all, 'feed', params] as const,
    drafts: (params?: ArticleFilterParams) =>
      [...queryKeys.articles.all, 'drafts', params] as const,
  },
  comments: {
    all: ['comments'] as const,
    byArticle: (articleId: string) =>
      [...queryKeys.comments.all, 'article', articleId] as const,
  },
  tags: {
    all: ['tags'] as const,
    popular: () => [...queryKeys.tags.all, 'popular'] as const,
  },
  profile: {
    all: ['profile'] as const,
    byUsername: (username: string) =>
      [...queryKeys.profile.all, username] as const,
    followers: (username: string) =>
      [...queryKeys.profile.all, username, 'followers'] as const,
    following: (username: string) =>
      [...queryKeys.profile.all, username, 'following'] as const,
  },
  bookmarks: {
    all: ['bookmarks'] as const,
    list: (params?: PaginationParams) =>
      [...queryKeys.bookmarks.all, 'list', params] as const,
  },
  notifications: {
    all: ['notifications'] as const,
    list: (params?: { page?: number; unreadOnly?: boolean; type?: string }) =>
      [...queryKeys.notifications.all, 'list', params] as const,
    unreadCount: () => [...queryKeys.notifications.all, 'unread-count'] as const,
  },
};
