import { NotificationsPage } from '@/features/notifications';
import { createFileRoute } from '@tanstack/react-router';
import { AuthGuard } from '@/features/auth/components/auth-guard';

export const Route = createFileRoute('/notifications')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AuthGuard>
      <NotificationsPage />
    </AuthGuard>
  );
}
