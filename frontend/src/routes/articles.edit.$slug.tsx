import { articleApi } from '@/features/articles/api/article-api';
import EditPage from '@/features/articles/pages/edit-page';
import { createFileRoute, useMatch } from '@tanstack/react-router';
import { AuthGuard } from '@/features/auth/components/auth-guard';

export const Route = createFileRoute('/articles/edit/$slug')({
  loader: async ({ params }) => await articleApi.previewBySlug(params.slug),
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

  return (
    <AuthGuard>
      <EditPage article={article} />
    </AuthGuard>
  );
}
