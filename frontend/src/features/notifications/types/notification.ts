export type NotificationType =
  | 'NewFollower'
  | 'ArticleClapped'
  | 'ArticleCommented'
  | 'CommentReplied'
  | 'ArticlePublished'
  | 'MentionedInComment'
  | 'SubmissionApproved'
  | 'SubmissionRejected';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  actionUrl?: string;
  relatedEntityId?: string;
  actorId?: string;
  actorName?: string;
  actorAvatarUrl?: string;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

export interface NotificationsResponse {
  items: Notification[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface UnreadCountResponse {
  count: number;
}
