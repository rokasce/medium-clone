import { Button } from '@/shared/components/ui/button';
import { Bookmark } from 'lucide-react';
import { useAuth } from '@/features/auth';
import { useToggleBookmark } from '../hooks/use-bookmarks';
import { cn } from '@/shared/lib/utils';

interface BookmarkButtonProps {
  articleId: string;
  isBookmarked: boolean;
  className?: string;
  variant?: 'default' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function BookmarkButton({
  articleId,
  isBookmarked,
  className,
  variant = 'ghost',
  size = 'icon',
}: BookmarkButtonProps) {
  const { isAuthenticated } = useAuth();
  const { toggleBookmark, isLoading } = useToggleBookmark();

  if (!isAuthenticated) {
    return null;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleBookmark(articleId, isBookmarked);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isLoading}
      className={cn(
        isBookmarked
          ? 'text-green-600 dark:text-green-500'
          : 'text-zinc-600 dark:text-zinc-400',
        'hover:text-green-700 dark:hover:text-green-400',
        className
      )}
      title={isBookmarked ? 'Remove bookmark' : 'Bookmark this article'}
    >
      <Bookmark className={cn('h-5 w-5', isBookmarked && 'fill-current')} />
    </Button>
  );
}
