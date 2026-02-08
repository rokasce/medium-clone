import { useState, useEffect } from 'react';
import { useSearch } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import { Loader2, Bookmark, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui';
import { useArticles } from '@/features/articles/hooks';
import type { ArticleSummary } from '@/types';

export default function SearchPage() {
  const { q } = useSearch({ from: '/search' });
  const [searchQuery, setSearchQuery] = useState(q ?? '');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching } = useArticles({
    search: q || undefined,
    page: currentPage,
    pageSize: 10,
  });

  const articles = data?.items ?? [];
  const totalPages = data?.totalPages ?? 1;

  useEffect(() => {
    setSearchQuery(q ?? '');
    setCurrentPage(1);
  }, [q]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Search</h1>
        {q && <p className="text-muted-foreground">Results for "{q}"</p>}
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {!isLoading && !q && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">
            Enter a search term to find articles
          </p>
        </div>
      )}

      {!isLoading && q && articles.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No articles found for "{q}"
          </p>
          <Button asChild variant="outline">
            <Link to="/">Browse all articles</Link>
          </Button>
        </div>
      )}

      {!isLoading && articles.length > 0 && (
        <>
          <div className="space-y-8">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || isFetching}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground px-4">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || isFetching}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
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
                <span>{article.clapCount} claps</span>
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
