import SearchPage from '@/pages/search.tsx';
import { createFileRoute } from '@tanstack/react-router';

type SearchParams = {
  q?: string;
  page?: number;
};

export const Route = createFileRoute('/search')({
  component: SearchPage,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      q: typeof search.q === 'string' ? search.q : undefined,
      page:
        typeof search.page === 'number'
          ? search.page
          : typeof search.page === 'string'
            ? parseInt(search.page, 10) || 1
            : 1,
    };
  },
});
