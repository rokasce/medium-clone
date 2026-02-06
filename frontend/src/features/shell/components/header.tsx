import { Search, PenSquare } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks';
import { Input } from '@/components/ui/input';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui';
import { ThemeToggle } from './theme-toggle';
import { Notifications } from '@/features/notifications';
import { Link, useNavigate } from '@tanstack/react-router';

export function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user: currentUser } = useAuth();

  const handleSignOut = () => {
    logout();
    navigate({ to: '/' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white dark:bg-zinc-950 dark:border-zinc-800">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-2xl font-serif dark:text-white">
            Medium
          </Link>

          <div className="hidden md:flex relative w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
            <Input
              type="search"
              placeholder="Search"
              className="pl-10 bg-zinc-50 border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800"
            />
          </div>
        </div>

        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              <Link to="/write">
                <Button variant="ghost" size="sm" className="gap-2">
                  <PenSquare className="h-4 w-4" />
                  <span className="hidden sm:inline">Write</span>
                </Button>
              </Link>

              <Notifications />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={currentUser?.image ?? ''}
                        alt={currentUser?.username}
                      />
                      <AvatarFallback>
                        {currentUser?.username
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/">Library</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/">Stories</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/">Stats</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Get Started
                </Button>
              </Link>
            </>
          )}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
