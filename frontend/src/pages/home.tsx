import { Link } from '@tanstack/react-router';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Badge } from '@/shared/components/ui/badge';
import { useAuth } from '@/features/auth';
import { useArticles } from '@/features/articles';
import { Bookmark, FileText, BarChart3, FileEdit } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { tagApi } from '@/features/tags/api/tag-api';
import { queryKeys } from '@/lib/query-keys';

export default function Home() {
  const { isAuthenticated, user, isLoading: isAuthLoading } = useAuth();

  // Fetch published articles
  const { data: articlesData, isLoading: isArticlesLoading } = useArticles({
    page: 1,
    pageSize: 10,
  });

  // Fetch popular tags
  const { data: tagsData } = useQuery({
    queryKey: queryKeys.tags.popular(),
    queryFn: () => tagApi.getPopular({ page: 1, pageSize: 5 }),
  });

  const userName = user?.username || 'User';
  const articles = articlesData?.items || [];
  const popularTags = tagsData?.items || [];

  // Show loading state
  if (isAuthLoading || isArticlesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  // Use first few articles as trending
  const trendingArticles = articles.slice(0, 4).map((article, index) => ({
    id: article.id,
    slug: article.slug,
    title: article.title,
    author: {
      name: article.author.username,
      avatar:
        article.author.image ||
        `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400`,
    },
    readTime: article.readingTimeMinutes,
    rank: index + 1,
  }));

  // Use first article as featured if available
  const featuredArticle = articles[0]
    ? {
        id: articles[0].id,
        slug: articles[0].slug,
        title: articles[0].title,
        excerpt: articles[0].subtitle || 'Read this featured article',
        author: {
          name: articles[0].author.username,
          avatar:
            articles[0].author.image ||
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        },
        readTime: articles[0].readingTimeMinutes,
        imageUrl:
          articles[0].featuredImageUrl ||
          'https://images.unsplash.com/photo-1762318953799-918e21d1fec4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBib29rJTIwZ2xhc3NlcyUyMG5vdGVib29rJTIwc3R1ZHklMjBkZXNrfGVufDF8fHx8MTc3MTY4MTc4MXww&ixlib=rb-4.1.0&q=80&w=1080',
      }
    : null;

  // Latest stories (exclude the first one used as featured)
  const latestStories = articles.slice(1, 4).map((article) => ({
    id: article.id,
    slug: article.slug,
    title: article.title,
    author: {
      name: article.author.username,
      avatar:
        article.author.image ||
        'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    },
    readTime: article.readingTimeMinutes,
    imageUrl:
      article.featuredImageUrl ||
      'https://images.unsplash.com/photo-1588730198871-e1b40374fc10?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjBtZWRpdGF0aW5nJTIwc3Vuc2V0JTIwYmVhY2h8ZW58MXx8fHwxNzcxNjgxNzgyfDA&ixlib=rb-4.1.0&q=80&w=1080',
  }));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-4 md:gap-8 h-14 overflow-x-auto">
            <Link
              to="/"
              className="text-sm font-medium border-b-2 border-black dark:border-white pb-4 pt-4 whitespace-nowrap"
            >
              Home
            </Link>
            <Link
              to="/discover"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white whitespace-nowrap"
            >
              Discover
            </Link>
            <Link
              to="/bookmarks"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white whitespace-nowrap"
            >
              Bookmarks
            </Link>
            <Link
              to="/write"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white whitespace-nowrap"
            >
              Write
            </Link>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-8">
        {isAuthenticated ? (
          // Logged In View
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left Sidebar */}
            <aside className="w-full lg:w-64 shrink-0">
              <h2 className="text-xl font-semibold mb-6 dark:text-white">
                Welcome back, {userName}
              </h2>

              <nav className="space-y-1 mb-8">
                <Link
                  to="/bookmarks"
                  className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
                >
                  <Bookmark className="h-4 w-4" />
                  Bookmarks
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
                >
                  <FileText className="h-4 w-4" />
                  Stories
                </Link>
                <Link
                  to="/"
                  className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
                >
                  <BarChart3 className="h-4 w-4" />
                  Stats
                </Link>
                <Link
                  to="/profile"
                  className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
                >
                  <FileEdit className="h-4 w-4" />
                  Drafts
                </Link>
              </nav>

              {/* Recommended Topics */}
              {popularTags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold mb-3 dark:text-white">
                    Recommended Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Trending Articles */}
              {trendingArticles.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-4 dark:text-white">
                    Trending Articles
                  </h3>
                  <div className="space-y-4">
                    {trendingArticles.map((article) => (
                      <Link
                        key={article.id}
                        to="/articles/$slug"
                        params={{ slug: article.slug }}
                        className="flex gap-3 group"
                      >
                        <span className="text-2xl font-bold text-zinc-200 dark:text-zinc-800">
                          0{article.rank}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={article.author.avatar} />
                              <AvatarFallback>
                                {article.author.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-zinc-600 dark:text-zinc-400">
                              {article.author.name}
                            </span>
                            <span className="text-xs text-zinc-400 dark:text-zinc-600">
                              ·
                            </span>
                            <span className="text-xs text-zinc-600 dark:text-zinc-400">
                              {article.readTime} min read
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold dark:text-white group-hover:underline line-clamp-2">
                            {article.title}
                          </h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold mb-2 dark:text-white">
                    Explore fresh ideas & new perspectives
                  </h1>
                  <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                    Read stories from our community of writers and thinkers.
                  </p>
                </div>
                <Link to="/write" className="self-start sm:self-auto">
                  <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                    Write a story
                  </Button>
                </Link>
              </div>

              {/* Featured Article */}
              {featuredArticle && (
                <Link
                  to="/articles/$slug"
                  params={{ slug: featuredArticle.slug }}
                  className="block mb-6 md:mb-8 group"
                >
                  <div className="relative h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden">
                    <img
                      src={featuredArticle.imageUrl}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 flex items-end">
                      <div className="p-4 sm:p-6 md:p-8 text-white">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 group-hover:underline">
                          {featuredArticle.title}
                        </h2>
                        <p className="text-sm sm:text-base text-zinc-200 mb-3 md:mb-4 line-clamp-2">
                          {featuredArticle.excerpt}
                        </p>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                            <AvatarImage src={featuredArticle.author.avatar} />
                            <AvatarFallback>
                              {featuredArticle.author.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs sm:text-sm">
                            {featuredArticle.author.name}
                          </span>
                          <span className="text-xs sm:text-sm text-zinc-300">·</span>
                          <span className="text-xs sm:text-sm text-zinc-300">
                            {featuredArticle.readTime} min read
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Latest Stories */}
              {latestStories.length > 0 && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 md:mb-6 dark:text-white">
                    Latest Stories
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {latestStories.map((story) => (
                      <Link
                        key={story.id}
                        to="/articles/$slug"
                        params={{ slug: story.slug }}
                        className="group"
                      >
                        <div className="mb-3 rounded-lg overflow-hidden aspect-video">
                          <img
                            src={story.imageUrl}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="text-lg font-bold mb-2 dark:text-white group-hover:underline line-clamp-2">
                          {story.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={story.author.avatar} />
                            <AvatarFallback>
                              {story.author.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            {story.author.name}
                          </span>
                          <span className="text-sm text-zinc-400 dark:text-zinc-600">
                            ·
                          </span>
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            {story.readTime} min read
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {articles.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                    No articles available yet. Be the first to write one!
                  </p>
                  <Link to="/write">
                    <Button className="bg-green-600 hover:bg-green-700">
                      Write a story
                    </Button>
                  </Link>
                </div>
              )}
            </main>
          </div>
        ) : (
          // Logged Out View
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left Section - Trending */}
            <aside className="w-full lg:w-64 shrink-0 order-2 lg:order-1">
              {trendingArticles.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-semibold mb-4 dark:text-white">
                    Trending Articles
                  </h3>
                  <div className="space-y-4">
                    {trendingArticles.map((article) => (
                      <Link
                        key={article.id}
                        to="/articles/$slug"
                        params={{ slug: article.slug }}
                        className="flex gap-3 group"
                      >
                        <span className="text-2xl font-bold text-zinc-200 dark:text-zinc-800">
                          0{article.rank}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={article.author.avatar} />
                              <AvatarFallback>
                                {article.author.name[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-zinc-600 dark:text-zinc-400">
                              {article.author.name}
                            </span>
                            <span className="text-xs text-zinc-400 dark:text-zinc-600">
                              ·
                            </span>
                            <span className="text-xs text-zinc-600 dark:text-zinc-400">
                              {article.readTime} min read
                            </span>
                          </div>
                          <h4 className="text-sm font-semibold dark:text-white group-hover:underline line-clamp-2">
                            {article.title}
                          </h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {popularTags.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3 dark:text-white">
                    Recommended Topics
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="secondary"
                        className="bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 cursor-pointer"
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </aside>

            {/* Main Content */}
            <main className="flex-1 order-1 lg:order-2">
              {/* Hero Section */}
              <div className="text-center mb-8 md:mb-12">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 md:mb-4 dark:text-white">
                  Explore fresh ideas & new perspectives
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-zinc-600 dark:text-zinc-400 mb-4 md:mb-6 px-4">
                  Read stories from our community of writers and thinkers.
                </p>
                <Link to="/signup">
                  <Button className="bg-green-600 hover:bg-green-700 px-6 py-4 sm:px-8 sm:py-6 text-base sm:text-lg">
                    Get started
                  </Button>
                </Link>
              </div>

              {/* Featured Article */}
              {featuredArticle && (
                <Link
                  to="/articles/$slug"
                  params={{ slug: featuredArticle.slug }}
                  className="block mb-6 md:mb-8 group"
                >
                  <div className="relative h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden">
                    <img
                      src={featuredArticle.imageUrl}
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 flex items-end">
                      <div className="p-4 sm:p-6 md:p-8 text-white">
                        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 group-hover:underline">
                          {featuredArticle.title}
                        </h2>
                        <p className="text-sm sm:text-base text-zinc-200 mb-3 md:mb-4 line-clamp-2">
                          {featuredArticle.excerpt}
                        </p>
                        <div className="flex items-center gap-2 sm:gap-3">
                          <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                            <AvatarImage src={featuredArticle.author.avatar} />
                            <AvatarFallback>
                              {featuredArticle.author.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs sm:text-sm">
                            {featuredArticle.author.name}
                          </span>
                          <span className="text-xs sm:text-sm text-zinc-300">·</span>
                          <span className="text-xs sm:text-sm text-zinc-300">
                            {featuredArticle.readTime} min read
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* Latest Stories */}
              {latestStories.length > 0 && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 md:mb-6 dark:text-white">
                    Latest Stories
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {latestStories.map((story) => (
                      <Link
                        key={story.id}
                        to="/articles/$slug"
                        params={{ slug: story.slug }}
                        className="group"
                      >
                        <div className="mb-3 rounded-lg overflow-hidden aspect-video">
                          <img
                            src={story.imageUrl}
                            alt={story.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="text-lg font-bold mb-2 dark:text-white group-hover:underline line-clamp-2">
                          {story.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={story.author.avatar} />
                            <AvatarFallback>
                              {story.author.name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            {story.author.name}
                          </span>
                          <span className="text-sm text-zinc-400 dark:text-zinc-600">
                            ·
                          </span>
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            {story.readTime} min read
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
}
