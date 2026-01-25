import { createFileRoute } from '@tanstack/react-router';
import { AuthenticatedLayout } from '@/app/layouts';
import { CreateArticleForm } from '@/features/articles/components/article-form';

export const Route = createFileRoute('/write')({
  component: CreateArticlePage,
});

function CreateArticlePage() {
  return (
    <AuthenticatedLayout>
      <CreateArticleForm />
    </AuthenticatedLayout>
  );
}
