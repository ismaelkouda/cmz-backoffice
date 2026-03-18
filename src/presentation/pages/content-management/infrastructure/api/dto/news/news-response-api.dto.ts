import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface NewsItemApiDto {
    id: string;
    type: string;
    title: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export type NewsResponseApiDto = PaginatedResponseDto<NewsItemApiDto>;
