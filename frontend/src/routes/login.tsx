import { AuthGuard } from '@/features';
import { LoginPage } from '@/features/auth';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  component: Login,
});

function Login() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/">
      <LoginPage />
    </AuthGuard>
  );
}
