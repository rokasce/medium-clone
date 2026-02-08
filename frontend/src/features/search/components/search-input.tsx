import { useState, useRef, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { Search, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui';
import { useArticles } from '@/features/articles/hooks';
import { useDebounce } from '@/shared/hooks/use-debounce';
import { Link } from '@tanstack/react-router';

export function SearchInput() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading } = useArticles({
    search: debouncedQuery || undefined,
    pageSize: 5,
  });

  const results = data?.items ?? [];
  const showDropdown = isOpen && query.length > 0;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      setIsOpen(false);
      navigate({ to: '/search', search: { q: query.trim() } });
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        ref={inputRef}
        type="search"
        placeholder="Search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        className="pl-10 bg-input-background border-border w-64"
      />

      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 overflow-hidden"
        >
          {isLoading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && results.length === 0 && debouncedQuery && (
            <div className="py-4 px-3 text-sm text-muted-foreground text-center">
              No articles found
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <>
              <div className="max-h-80 overflow-y-auto">
                {results.map((article) => (
                  <Link
                    key={article.slug}
                    to="/articles/$slug"
                    params={{ slug: article.slug }}
                    onClick={handleResultClick}
                    className="flex items-start gap-3 px-3 py-2 hover:bg-muted transition-colors"
                  >
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage
                        src={article.author.image}
                        alt={article.author.username}
                      />
                      <AvatarFallback>
                        {article.author.username
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-1">
                        {article.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {article.author.username}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              <Link
                to="/search"
                search={{ q: query }}
                onClick={handleResultClick}
                className="block px-3 py-2 text-sm text-center text-primary hover:bg-muted border-t border-border"
              >
                See all results for "{query}"
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
