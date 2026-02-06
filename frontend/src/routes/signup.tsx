import { AuthGuard } from '@/features';
import SignupPage from '@/features/auth/pages/signup-page';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/signup')({
  component: Signup,
});

function Signup() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/dashboard">
      <SignupPage />
    </AuthGuard>
  );
}
