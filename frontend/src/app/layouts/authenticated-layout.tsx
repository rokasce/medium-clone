import { Container } from './container';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <Container className="py-8">{children}</Container>
      </main>
    </div>
  );
}
