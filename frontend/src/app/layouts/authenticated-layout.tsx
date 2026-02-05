import { Container } from './container';
import { Header } from '@/components/header';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Container className="py-8">{children}</Container>
      </main>
    </div>
  );
}
