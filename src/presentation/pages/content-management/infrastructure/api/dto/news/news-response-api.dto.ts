import { SelectDto } from '@shared/data/dto/select.dto';
import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface NewsItemApiDto {
    id: string;
    type: string;
    title: string;
    category: SelectDto;
    sub_category: SelectDto;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export type NewsResponseApiDto = PaginatedResponseDto<NewsItemApiDto>;
