import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Separator,
} from '@/shared/components/ui';
import { Link } from '@tanstack/react-router';
import { Bookmark, PenLine, X } from 'lucide-react';
import type { ArticleSummary } from '@/types';
import { useHomePage } from './hooks/use-home-page';

export default function Home() {
  const {
    isAuthenticated,
    isAuthLoading,
    user,
    articles,
    isArticlesLoading,
    popularTags,
    selectedTag,
    selectedTagName,
    handleTagSelect,
    clearTagFilter,
  } = useHomePage();

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main content - Article feed */}
        <div className="lg:col-span-8">
          {/* Personalized greeting for authenticated users */}
          {isAuthenticated && user && (
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
              <div className="flex items-center gap-3">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.username}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                ) : (
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {user.username
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">Welcome back</p>
                  <p className="font-semibold text-foreground">
                    {user.username}
                  </p>
                </div>
              </div>
              <Button asChild>
                <Link to="/write" className="gap-2">
                  <PenLine className="h-4 w-4" />
                  Write
                </Link>
              </Button>
            </div>
          )}

          {/* Active filter indicator */}
          {selectedTag && (
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border">
              <span className="text-sm text-muted-foreground">
                Filtering by:
              </span>
              <Button
                variant="secondary"
                size="sm"
                className="rounded-full"
                onClick={clearTagFilter}
              >
                {selectedTagName}
                <X className="h-3 w-3 ml-1" />
              </Button>
            </div>
          )}

          {/* Loading state */}
          {isArticlesLoading && (
            <div className="space-y-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border-b border-border pb-8 animate-pulse"
                >
                  <div className="flex gap-6">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 bg-muted rounded-full" />
                        <div className="h-4 bg-muted rounded w-24" />
                      </div>
                      <div className="h-6 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-full" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                    <div className="hidden sm:block w-40 h-28 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isArticlesLoading && articles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No articles found. Be the first to write one!
              </p>
              <Button asChild>
                <Link to="/write">Write an Article</Link>
              </Button>
            </div>
          )}

          {/* Articles list */}
          {!isArticlesLoading && articles.length > 0 && (
            <div className="space-y-8">
              {articles.map((article) => (
                <ArticleCard key={article.slug} article={article} />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block lg:col-span-4">
          <div className="sticky top-20">
            {/* Quick actions for authenticated users */}
            {isAuthenticated && (
              <>
                <Card className="mb-6">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to="/write">
                        <PenLine className="h-4 w-4 mr-2" />
                        New Article
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <Link to="/profile">
                        <Bookmark className="h-4 w-4 mr-2" />
                        Your Drafts
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
                <Separator className="my-6" />
              </>
            )}

            {/* Trending articles */}
            {articles.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold mb-4 text-foreground">
                  Trending Articles
                </h3>
                <div className="space-y-4">
                  {articles.slice(0, 3).map((article, index) => (
                    <Link
                      key={article.slug}
                      to="/articles/$slug"
                      params={{ slug: article.slug }}
                      className="block group"
                    >
                      <div className="flex gap-4">
                        <span className="text-3xl text-muted-foreground font-serif">
                          0{index + 1}
                        </span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="h-5 w-5">
                              <AvatarImage
                                src={article.author.image}
                                alt={article.author.username}
                              />
                              <AvatarFallback>
                                {article.author.username
                                  .split(' ')
                                  .map((n) => n[0])
                                  .join('')}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-foreground">
                              {article.author.username}
                            </span>
                          </div>
                          <h4 className="font-semibold text-sm line-clamp-2 group-hover:underline text-foreground">
                            {article.title}
                          </h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <Separator className="my-6" />

            <div>
              <h3 className="font-semibold mb-4 text-foreground">
                Discover more of what matters to you
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Button
                    key={tag.id}
                    variant={selectedTag === tag.id ? 'default' : 'outline'}
                    size="sm"
                    className="rounded-full"
                    onClick={() => handleTagSelect(tag.id)}
                  >
                    {tag.name}
                    {selectedTag === tag.id && <X className="h-3 w-3 ml-1" />}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <article className="border-b border-border pb-8">
      <Link
        to="/articles/$slug"
        params={{ slug: article.slug }}
        className="block group"
      >
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={article.author.image}
                  alt={article.author.username}
                />
                <AvatarFallback>
                  {article.author.username
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-foreground">
                {article.author.username}
              </span>
            </div>

            <h2 className="text-xl font-bold mb-2 group-hover:underline line-clamp-2 text-foreground">
              {article.title}
            </h2>

            {article.subtitle && (
              <p className="text-muted-foreground mb-4 line-clamp-2">
                {article.subtitle}
              </p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString()
                    : 'Draft'}
                </span>
                <span>·</span>
                <span>{article.readingTimeMinutes} min read</span>
                <span>·</span>
                <span>{article.clapsCount} claps</span>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground"
              >
                <Bookmark className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {article.featuredImageUrl && (
            <div className="hidden sm:block w-40 h-28 shrink-0">
              <img
                src={article.featuredImageUrl}
                alt={article.title}
                className="w-full h-full object-cover rounded"
              />
            </div>
          )}
        </div>
      </Link>
    </article>
  );
}
