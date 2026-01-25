// Article status matching backend domain
export type ArticleStatus = 'Draft' | 'Published' | 'Unpublished' | 'Deleted';

// Author entity
export interface Author {
  id: string;
  username: string;
  bio?: string;
  image?: string;
  articleCount: number;
  followerCount: number;
  followingCount: number;
  totalViews: number;
  totalClaps: number;
  isFollowing?: boolean;
}

// Tag entity
export interface Tag {
  slug: string;
  name: string;
  articleCount: number;
}

// Article entity
export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  content: string;
  featuredImage?: string;
  status: ArticleStatus;
  readingTimeMinutes: number;
  createdAt: string;
  updatedAt?: string;
  publishedAt?: string;
  author: Author;
  tags: Tag[];
  clapsCount: number;
  commentsCount: number;
  viewsCount: number;
  isClapped?: boolean;
  isBookmarked?: boolean;
}

// Article summary for lists (lighter payload)
export interface ArticleSummary {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  featuredImage?: string;
  status: ArticleStatus;
  readingTimeMinutes: number;
  createdAt: string;
  publishedAt?: string;
  author: Pick<Author, 'id' | 'username' | 'image'>;
  tags: Tag[];
  clapsCount: number;
  commentsCount: number;
  isClapped?: boolean;
  isBookmarked?: boolean;
}

// Comment entity
export interface Comment {
  id: string;
  body: string;
  createdAt: string;
  updatedAt?: string;
  author: Pick<Author, 'id' | 'username' | 'image'>;
  articleId: string;
  likesCount: number;
  isLiked?: boolean;
  replies?: CommentReply[];
}

// Comment reply
export interface CommentReply {
  id: string;
  body: string;
  createdAt: string;
  author: Pick<Author, 'id' | 'username' | 'image'>;
  likesCount: number;
  isLiked?: boolean;
}

// Bookmark / Reading list item
export interface Bookmark {
  id: string;
  article: ArticleSummary;
  createdAt: string;
}

// Notification
export type NotificationType =
  | 'NewFollower'
  | 'ArticlePublished'
  | 'ArticleClapped'
  | 'CommentReceived'
  | 'CommentLiked'
  | 'MentionInComment';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  isRead: boolean;
  createdAt: string;
  relatedArticleId?: string;
  relatedUserId?: string;
}

// Pagination
export interface PagedResult<T> {
  page: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  data: T[];
}

// API Error response
export interface ApiError {
  code: string;
  message: string;
  errors?: Record<string, string[]>;
}

// Common request params
export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface ArticleFilterParams extends PaginationParams {
  tag?: string;
  author?: string;
  status?: ArticleStatus;
  search?: string;
}
