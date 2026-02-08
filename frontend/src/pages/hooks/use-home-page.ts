import { useState } from 'react';
import { useAuth } from '@/features/auth/hooks';
import { useArticles } from '@/features/articles/hooks';
import { usePopularTags } from '@/features/tags/hooks';

export function useHomePage() {
  const { isAuthenticated, isLoading: isAuthLoading, user } = useAuth();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Fetch popular tags from API
  const { data: tagsData, isLoading: isTagsLoading } = usePopularTags({
    page: 1,
    pageSize: 5,
  });

  // Fetch filtered articles
  const { data: articlesData, isLoading: isArticlesLoading } = useArticles({
    page: 1,
    pageSize: 10,
    tagId: selectedTag ?? undefined,
  });

  const articles = articlesData?.items ?? [];
  const popularTags = tagsData?.items ?? [];

  const handleTagSelect = (tagId: string) => {
    setSelectedTag(selectedTag === tagId ? null : tagId);
  };

  const clearTagFilter = () => {
    setSelectedTag(null);
  };

  const selectedTagName = selectedTag
    ? (popularTags.find((t) => t.id === selectedTag)?.name ?? selectedTag)
    : null;

  return {
    // Auth state
    isAuthenticated,
    isAuthLoading,
    user,

    // Articles state
    articles,
    isArticlesLoading,

    // Tags state
    popularTags,
    isTagsLoading,
    selectedTag,
    selectedTagName,

    // Actions
    handleTagSelect,
    clearTagFilter,
  };
}
