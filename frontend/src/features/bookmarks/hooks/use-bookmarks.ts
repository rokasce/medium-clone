import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { bookmarkApi } from '../api/bookmark-api';
import { useToast } from '@/shared/components/ui/use-toast';

export function useBookmarks() {
  return useQuery({
    queryKey: queryKeys.bookmarks.all,
    queryFn: () => bookmarkApi.getUserBookmarks(),
  });
}

export function useAddBookmark() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (articleId: string) => bookmarkApi.addBookmark(articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookmarks.all,
      });
      toast({
        title: 'Bookmarked',
        description: 'Article added to your bookmarks.',
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to bookmark article';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    },
  });
}

export function useRemoveBookmark() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (articleId: string) => bookmarkApi.removeBookmark(articleId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.bookmarks.all,
      });
      toast({
        title: 'Removed',
        description: 'Article removed from your bookmarks.',
      });
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to remove bookmark';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
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
