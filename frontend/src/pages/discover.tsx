import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { TrendingUp, Clock, Bookmark } from 'lucide-react';
import {
  useArticles,
  useBookmarkArticle,
  useRemoveBookmark,
} from '@/features/articles';
import { useQuery } from '@tanstack/react-query';
import { tagApi } from '@/features/tags/api/tag-api';
import { queryKeys } from '@/lib/query-keys';

export default function Discover() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch articles from backend
  const { data: articlesData, isLoading } = useArticles({
    page: 1,
    pageSize: 20,
  });

  // Fetch popular tags
  const { data: tagsData } = useQuery({
    queryKey: queryKeys.tags.popular(),
    queryFn: () => tagApi.getPopular({ page: 1, pageSize: 6 }),
  });

  const bookmarkMutation = useBookmarkArticle();
  const removeBookmarkMutation = useRemoveBookmark();

  const articles = articlesData?.items || [];
  const popularTags = tagsData?.items || [];

  // Map tags to trending topics with colors
  const trendingTopics = popularTags.map((tag, index) => {
    const colors = [
      'bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300',
      'bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300',
      'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300',
      'bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300',
      'bg-pink-100 dark:bg-pink-950 text-pink-700 dark:text-pink-300',
      'bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300',
    ];
    return {
      id: tag.id,
      name: tag.name,
      color: colors[index % colors.length],
    };
  });

  // Filter articles - for now just show all since we don't have category filtering in the API yet
  const filteredArticles = articles;

  // Show top 3 articles as trending
  const trendingArticles = articles.slice(0, 3);

  const handleBookmark = (articleId: string, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    // For now, just toggle bookmark - we'd need to check if already bookmarked
    bookmarkMutation.mutate(articleId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Secondary Navigation */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-8 h-14">
            <Link
              to="/"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            >
              Home
            </Link>
            <Link
              to="/discover"
              className="text-sm font-medium border-b-2 border-green-600 dark:border-green-500 pb-4 pt-4"
            >
              Discover
            </Link>
            <Link
              to="/bookmarks"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            >
              Bookmarks
            </Link>
            <Link
              to="/write"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white"
            >
              Write
            </Link>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-3 dark:text-white">
              Discover Stories
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Explore diverse perspectives and compelling narratives from
              writers worldwide.
            </p>
          </div>

          {/* Trending Topics */}
          {trendingTopics.length > 0 && (
            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-500" />
                <h2 className="text-xl font-bold dark:text-white">
                  Trending Topics
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingTopics.map((topic) => (
                  <Badge
                    key={topic.id}
                    variant="secondary"
                    className={`${topic.color} px-4 py-2 text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity`}
                  >
                    {topic.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Trending Articles Highlight */}
          {trendingArticles.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 dark:text-white">
                Trending Now
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {trendingArticles.map((article) => (
                  <Link
                    key={article.id}
                    to="/articles/$slug"
                    params={{ slug: article.slug }}
                    className="group bg-white dark:bg-zinc-900 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 hover:shadow-lg transition-shadow"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={
                          article.featuredImageUrl ||
                          'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400'
                        }
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-3 right-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-500" />
                        <span className="text-xs font-medium text-zinc-900 dark:text-white">
                          {article.clapCount || 0}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-500 transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={article.author.image} />
                          <AvatarFallback>
                            {article.author.username[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span>{article.author.username}</span>
                        <span>·</span>
                        <Clock className="h-3 w-3" />
                        <span>{article.readingTimeMinutes} min</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All Articles */}
          <div>
            <h2 className="text-2xl font-bold mb-6 dark:text-white">
              All Stories
            </h2>
            <div className="space-y-6">
              {filteredArticles.map((article) => (
                <div
                  key={article.id}
                  className="flex gap-6 p-6 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow"
                >
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={article.author.image} />
                        <AvatarFallback>
                          {article.author.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        {article.author.username}
                      </span>
                      <span className="text-zinc-400 dark:text-zinc-600">
                        ·
                      </span>
                      <span className="text-sm text-zinc-600 dark:text-zinc-400">
                        {article.publishedAt
                          ? new Date(article.publishedAt).toLocaleDateString()
                          : 'Draft'}
                      </span>
                    </div>

                    <Link
                      to="/articles/$slug"
                      params={{ slug: article.slug }}
                      className="group"
                    >
                      <h3 className="text-2xl font-bold mb-2 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-500 transition-colors">
                        {article.title}
                      </h3>
                      {article.subtitle && (
                        <p className="text-zinc-600 dark:text-zinc-400 mb-4 line-clamp-2">
                          {article.subtitle}
                        </p>
                      )}
                    </Link>

                    <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{article.readingTimeMinutes} min read</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>{article.clapCount || 0} claps</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto"
                        onClick={(e) => handleBookmark(article.id, e)}
                        disabled={bookmarkMutation.isPending}
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Thumbnail */}
                  {article.featuredImageUrl && (
                    <Link
                      to="/articles/$slug"
                      params={{ slug: article.slug }}
                      className="shrink-0"
                    >
                      <img
                        src={article.featuredImageUrl}
                        alt={article.title}
                        className="w-48 h-32 object-cover rounded"
                      />
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* Empty state */}
            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <p className="text-zinc-600 dark:text-zinc-400">
                  No articles found. Check back later for new content!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
