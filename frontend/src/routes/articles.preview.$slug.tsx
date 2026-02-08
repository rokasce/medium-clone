import { createFileRoute, useMatch, useSearch } from '@tanstack/react-router';
import { articleApi } from '@/features/articles/api/article-api';
import { Article } from '@/features/articles/components/article';
import type { ArticleStatus } from '@/types';

export const Route = createFileRoute('/articles/preview/$slug')({
  validateSearch: (search: Record<string, unknown>) => ({
    status: (search.status as ArticleStatus) || undefined,
  }),
  loader: async ({ params }) => await articleApi.previewBySlug(params.slug),
  component: RouteComponent,
});

function RouteComponent() {
  const match = useMatch({ from: Route.id });
  const { status } = useSearch({ from: Route.id });
  const article = match?.loaderData;

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading…</div>
      </div>
    );
  }

  // Merge status from search params if API doesn't provide it
  const articleWithStatus = {
    ...article,
    status: article.status || status || 'Draft',
  };

  return <Article article={articleWithStatus} />;
}
