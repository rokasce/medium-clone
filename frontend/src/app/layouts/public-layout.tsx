import { Link } from '@tanstack/react-router';
import { Container } from './container';
import { Button } from '@/components/ui/button';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <Container className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/" className="font-bold text-xl">
              Blog
            </a>
            <nav className="hidden md:flex items-center gap-4">
              <a
                href="/"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Home
              </a>
              <a
                href="/explore"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Explore
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link
                to="/signup"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign in
              </Link>
            </Button>
          </div>
        </Container>
      </header>
      <main>{children}</main>
    </div>
  );
}
