import { BaseAPI } from '@/shared/lib/base-api';

export interface ImageUploadResponse {
  url: string;
}

export class ImageAPI extends BaseAPI {
  async uploadArticleImage(file: File): Promise<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    return this.handleRequest(() =>
      this.axiosInstance.post<ImageUploadResponse>(
        '/images/articles',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
    );
  }
}

export const imageApi = new ImageAPI();
