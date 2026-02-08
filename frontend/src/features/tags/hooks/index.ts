import { useQuery } from '@tanstack/react-query';
import { tagApi } from '../api/tag-api';

export function usePopularTags(params?: { page?: number; pageSize?: number }) {
  return useQuery({
    queryKey: ['tags', 'popular', params],
    queryFn: () => tagApi.getPopular(params),
  });
}
