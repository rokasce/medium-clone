import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { queryKeys } from '@/lib/query-keys';
import { ArticleApi } from '../api/article-api';
import type { ArticleFilterParams } from '@/types';
import type { CreateArticleInput, UpdateArticleInput } from '../schemas/article-schemas';

// Query hooks

export function useArticles(params?: ArticleFilterParams) {
  return useQuery({
    queryKey: queryKeys.articles.list(params),
    queryFn: () => ArticleApi.getPublished(params),
  });
}

export function useArticle(slug: string) {
  return useQuery({
    queryKey: queryKeys.articles.detail(slug),
    queryFn: () => ArticleApi.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useMyDrafts(params?: ArticleFilterParams) {
  return useQuery({
    queryKey: queryKeys.articles.drafts(params),
    queryFn: () => ArticleApi.getMyDrafts(params),
  });
}

export function useAuthorArticles(authorId: string, params?: ArticleFilterParams) {
  return useQuery({
    queryKey: queryKeys.articles.byAuthor(authorId),
    queryFn: () => ArticleApi.getByAuthor(authorId, params),
    enabled: !!authorId,
  });
}

export function useFeed(params?: ArticleFilterParams) {
  return useQuery({
    queryKey: queryKeys.articles.feed(params),
    queryFn: () => ArticleApi.getFeed(params),
  });
}

// Infinite query for infinite scroll
export function useInfiniteArticles(params?: Omit<ArticleFilterParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.articles.list(params), 'infinite'],
    queryFn: ({ pageParam = 1 }) => ArticleApi.getPublished({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
  });
}

// Mutation hooks

export function useCreateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateArticleInput) => ArticleApi.createDraft(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
    },
  });
}

export function useUpdateArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateArticleInput }) => ArticleApi.update(id, data),
    onSuccess: (article) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
      queryClient.setQueryData(queryKeys.articles.detail(article.slug), article);
    },
  });
}

export function usePublishArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ArticleApi.publish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
    },
  });
}

export function useUnpublishArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ArticleApi.unpublish(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
    },
  });
}

export function useDeleteArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ArticleApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
    },
  });
}

export function useClapArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ArticleApi.clap(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
    },
  });
}

export function useBookmarkArticle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ArticleApi.bookmark(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookmarks.all });
    },
  });
}

export function useRemoveBookmark() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ArticleApi.removeBookmark(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.articles.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.bookmarks.all });
    },
  });
}
