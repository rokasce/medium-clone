import { BaseAPI } from '@/shared/lib/base-api';
import type { PagedResult } from '@/shared/types/api';
import type { Tag } from '@/types';

export class TagAPI extends BaseAPI {
  async getPopular(params?: {
    page?: number;
    pageSize?: number;
  }): Promise<PagedResult<Tag>> {
    return this.handleRequest(() =>
      this.axiosInstance.get<PagedResult<Tag>>('/tags/popular', {
        params,
      })
    );
  }
}

export const tagApi = new TagAPI();
