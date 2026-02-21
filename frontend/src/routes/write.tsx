import { createFileRoute } from '@tanstack/react-router';
import { WritePage } from '@/features/articles';
import { AuthGuard } from '@/features/auth/components/auth-guard';

export const Route = createFileRoute('/write')({
  component: CreateArticlePage,
});

function CreateArticlePage() {
  return (
    <AuthGuard>
      <WritePage />
    </AuthGuard>
  );
}
