import SearchPage from '@/pages/search';
import { createFileRoute } from '@tanstack/react-router';

type SearchParams = {
  q?: string;
};

export const Route = createFileRoute('/search')({
  component: SearchPage,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      q: typeof search.q === 'string' ? search.q : undefined,
    };
  },
});
