import { AuthGuard, RegisterForm } from '@/features';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/register')({
  component: RegisterPage,
});

function RegisterPage() {
  return (
    <AuthGuard requireAuth={false} redirectTo="/dashboard">
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <RegisterForm />
      </div>
    </AuthGuard>
  );
}
