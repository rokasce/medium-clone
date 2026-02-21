import { Profile } from '@/pages/profile.tsx';
import { createFileRoute } from '@tanstack/react-router';
import { AuthGuard } from '@/features/auth/components/auth-guard';

export const Route = createFileRoute('/profile')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <AuthGuard>
      <Profile />
    </AuthGuard>
  );
}
