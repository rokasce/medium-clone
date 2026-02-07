import { articleApi } from '@/features/articles/api/article-api';
import EditPage from '@/features/articles/pages/edit-page';
import { createFileRoute, useMatch } from '@tanstack/react-router';

export const Route = createFileRoute('/articles/edit/$slug')({
  loader: async ({ params }) => await articleApi.getBySlug(params.slug),
  component: RouteComponent,
});

function RouteComponent() {
  const match = useMatch({ from: Route.id });
  const article = match?.loaderData;

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading…</div>
      </div>
    );
  }

  return <EditPage article={article} />;
}
