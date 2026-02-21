import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { commentApi } from '../api/comment-api';
import type { AddCommentRequest } from '../types/comment';

export function useComments(articleId: string) {
  return useQuery({
    queryKey: queryKeys.comments.byArticle(articleId),
    queryFn: () => commentApi.getComments(articleId),
    enabled: !!articleId,
  });
}

export function useAddComment(articleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddCommentRequest) =>
      commentApi.addComment(articleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.byArticle(articleId),
      });
    },
  });
}

export function useDeleteComment(articleId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commentId: string) =>
      commentApi.deleteComment(articleId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.comments.byArticle(articleId),
      });
    },
  });
}
