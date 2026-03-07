import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { bookmarkApi } from '../api/bookmark-api';
import { toast } from 'sonner';
import type { ApiError } from '@/shared/types/api';

export function useBookmarks() {
  return useQuery({
    queryKey: queryKeys.bookmarks.all,
    queryFn: () => bookmarkApi.getUserBookmarks(),
  });
}

export function useAddBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleId: string) => bookmarkApi.addBookmark(articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookmarks.all,
      });
      toast.success('Article added to your bookmarks');
    },
    onError: (error: ApiError) => {
      const message = error.message || 'Failed to bookmark article';
      toast.error(message);
    },
  });
}

export function useRemoveBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (articleId: string) => bookmarkApi.removeBookmark(articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookmarks.all,
      });
      toast.success('Article removed from your bookmarks');
    },
    onError: (error: ApiError) => {
      const message = error.message || 'Failed to remove bookmark';
      toast.error(message);
    },
  });
}

export function useToggleBookmark() {
  const addBookmark = useAddBookmark();
  const removeBookmark = useRemoveBookmark();

  return {
    toggleBookmark: (articleId: string, isBookmarked: boolean) => {
      if (isBookmarked) {
        removeBookmark.mutate(articleId);
      } else {
        addBookmark.mutate(articleId);
      }
    },
    isLoading: addBookmark.isPending || removeBookmark.isPending,
  };
}
