import { AuthGuard } from '@/features';
import { PasswordResetPage } from '@/features/auth';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/forgot-password')({
  component: ForgotPassword,
});

function ForgotPassword() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/">
      <PasswordResetPage />
    </AuthGuard>
  );
}
