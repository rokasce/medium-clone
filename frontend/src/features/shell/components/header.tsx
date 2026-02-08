import { useState } from 'react';
import { PenSquare, Search, X } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks';
import { SearchInput } from '@/features/search';
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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    navigate({ to: '/' });
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          {mobileSearchOpen ? (
            <div className="flex items-center gap-2 md:hidden">
              <SearchInput />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <Link to="/" className="text-2xl font-serif text-foreground">
                Medium
              </Link>

              <div className="hidden md:flex">
                <SearchInput />
              </div>
            </>
          )}
        </div>

        <nav className={`flex items-center gap-4 ${mobileSearchOpen ? 'hidden md:flex' : ''}`}>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileSearchOpen(true)}
          >
            <Search className="h-4 w-4" />
          </Button>
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
