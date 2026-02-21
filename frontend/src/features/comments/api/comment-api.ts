import { BaseAPI } from '@/shared/lib/base-api';
import type { AddCommentRequest, Comment } from '../types/comment';

export class CommentAPI extends BaseAPI {
  async getComments(articleId: string): Promise<Comment[]> {
    return this.handleRequest(() =>
      this.axiosInstance.get<Comment[]>(`/articles/${articleId}/comments`)
    );
  }

  async addComment(
    articleId: string,
    data: AddCommentRequest
  ): Promise<string> {
    return this.handleRequest(() =>
      this.axiosInstance.post<string>(`/articles/${articleId}/comments`, data)
    );
  }

  async deleteComment(articleId: string, commentId: string): Promise<void> {
    return this.handleRequest(() =>
      this.axiosInstance.delete<void>(
        `/articles/${articleId}/comments/${commentId}`
      )
    );
  }
}

export const commentApi = new CommentAPI();
