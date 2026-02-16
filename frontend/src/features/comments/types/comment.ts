export interface Comment {
  id: string;
  articleId: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string;
  content: string;
  status: 'Active' | 'Edited' | 'Deleted';
  likeCount: number;
  createdAt: string;
  updatedAt?: string;
  replies: Comment[];
}

export interface AddCommentRequest {
  content: string;
  parentCommentId?: string;
}
