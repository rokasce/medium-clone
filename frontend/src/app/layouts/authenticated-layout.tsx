import { useAuth } from '@/features/auth';
import { Container } from './container';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <a href="/write">Write</a>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.image} alt={user?.username} />
                    <AvatarFallback>
                      {user?.username?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user?.name && <p className="font-medium">{user.name}</p>}
                    {user?.username && (
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        @{user.username}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <a href={`/@${user?.username}`}>Profile</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/dashboard">Dashboard</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/bookmarks">Bookmarks</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/settings">Settings</a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Container>
      </header>
      <main>
        <Container className="py-8">{children}</Container>
      </main>
    </div>
  );
}
