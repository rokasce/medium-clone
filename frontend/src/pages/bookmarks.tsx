import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/shared/components/ui/avatar';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Bookmark,
  FileText,
  BarChart3,
  FileEdit,
  Search,
  MoreVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useAuth } from '@/features/auth';
import { useBookmarks, useRemoveBookmark } from '@/features/bookmarks';

export default function Bookmarks() {
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const { data: bookmarks, isLoading } = useBookmarks();
  const removeBookmark = useRemoveBookmark();

  if (!user) {
    return null;
  }

  const userName = user.username;

  const filteredArticles =
    bookmarks?.filter((bookmark) => {
      const matchesSearch =
        searchQuery === '' ||
        bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        bookmark.author.displayName
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
      return matchesSearch;
    }) || [];

  const handleRemoveBookmark = (articleId: string) => {
    removeBookmark.mutate(articleId);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Secondary Navigation */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-4 md:gap-8 h-14 overflow-x-auto">
            <Link
              to="/"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white whitespace-nowrap"
            >
              Home
            </Link>
            <Link
              to="/discover"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white whitespace-nowrap"
            >
              Discover
            </Link>
            <Link
              to="/bookmarks"
              className="text-sm font-medium border-b-2 border-green-600 dark:border-green-500 pb-4 pt-4 whitespace-nowrap"
            >
              Bookmarks
            </Link>
            <Link
              to="/write"
              className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white whitespace-nowrap"
            >
              Write
            </Link>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Left Sidebar */}
          <aside className="w-full lg:w-64 shrink-0">
            <h2 className="text-xl font-semibold mb-6 dark:text-white">
              Welcome back, {userName}
            </h2>

            <nav className="space-y-1">
              <Link
                to="/bookmarks"
                className="flex items-center gap-3 px-3 py-2 text-sm text-green-700 dark:text-green-500 bg-green-50 dark:bg-green-950/30 rounded border-l-4 border-green-600 dark:border-green-500"
              >
                <Bookmark className="h-4 w-4" />
                Bookmarks
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
              >
                <FileText className="h-4 w-4" />
                Stories
              </Link>
              <Link
                to="/"
                className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
              >
                <BarChart3 className="h-4 w-4" />
                Stats
              </Link>
              <Link
                to="/profile"
                className="flex items-center gap-3 px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded"
              >
                <FileEdit className="h-4 w-4" />
                Drafts
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-3xl">
            <div className="mb-4 md:mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 dark:text-white">
                Your Bookmarks
              </h1>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
                Saved stories for easy access when you need them.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4 md:mb-6">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400 dark:text-zinc-500" />
              <Input
                type="search"
                placeholder="Search bookmarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-sm md:text-base"
              />
            </div>

            {/* Bookmarked Articles List */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-zinc-600 dark:text-zinc-400">
                    Loading bookmarks...
                  </p>
                </div>
              ) : filteredArticles.length === 0 ? (
                <div className="text-center py-12">
                  <Bookmark className="h-12 w-12 mx-auto mb-4 text-zinc-300 dark:text-zinc-700" />
                  <p className="text-zinc-600 dark:text-zinc-400">
                    {searchQuery
                      ? 'No bookmarks found matching your search.'
                      : 'No bookmarks yet. Start bookmarking articles you want to read later!'}
                  </p>
                </div>
              ) : (
                filteredArticles.map((bookmark) => (
                  <div
                    key={bookmark.articleId}
                    className="flex flex-col sm:flex-row gap-3 sm:gap-4 p-3 sm:p-4 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:shadow-md transition-shadow"
                  >
                    {/* Thumbnail */}
                    {bookmark.featuredImageUrl && (
                      <Link
                        to="/articles/$slug"
                        params={{ slug: bookmark.slug }}
                        className="shrink-0 order-1"
                      >
                        <img
                          src={bookmark.featuredImageUrl}
                          alt={bookmark.title}
                          className="w-full sm:w-20 md:w-24 h-40 sm:h-20 md:h-24 object-cover rounded"
                        />
                      </Link>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0 order-2">
                      <Link
                        to="/articles/$slug"
                        params={{ slug: bookmark.slug }}
                        className="group"
                      >
                        <h3 className="text-base sm:text-lg font-bold mb-2 dark:text-white group-hover:underline line-clamp-2">
                          {bookmark.title}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <Avatar className="h-4 w-4 sm:h-5 sm:w-5">
                          <AvatarImage
                            src={bookmark.author.avatarUrl || undefined}
                          />
                          <AvatarFallback>
                            {bookmark.author.displayName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 truncate">
                          {bookmark.author.displayName}
                        </span>
                        <span className="text-xs sm:text-sm text-zinc-400 dark:text-zinc-600">
                          ·
                        </span>
                        <span className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
                          {bookmark.readingTimeMinutes} min read
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col items-center sm:items-start gap-1 sm:gap-2 order-3 self-start sm:self-auto">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveBookmark(bookmark.articleId)}
                        disabled={removeBookmark.isPending}
                        className="text-green-600 dark:text-green-500 hover:text-green-700 dark:hover:text-green-400 h-8 w-8 sm:h-10 sm:w-10"
                      >
                        <Bookmark className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
                            <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-600 dark:text-zinc-400" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              handleRemoveBookmark(bookmark.articleId)
                            }
                          >
                            Remove bookmark
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
