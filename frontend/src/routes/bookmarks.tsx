import BookmarksPage from '@/pages/bookmarks';
import { createFileRoute } from '@tanstack/react-router';
import { AuthGuard } from '@/features/auth/components/auth-guard';

export const Route = createFileRoute('/bookmarks')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AuthGuard>
      <BookmarksPage />
    </AuthGuard>
  );
}
