import { PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';
import { TypeMediaDto } from '@shared/data/dtos/type-media.dto';

export interface NewsItemDto {
    id: string;
    slug: string;
    title: string;
    resume: string;
    content: string;
    type: TypeMediaDto;
    category_id: number;
    sub_category_id: number | null;
    hashtags: string[];
    image_file: string;
    video_url: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export interface NewsResponseDto extends PaginatedResponseDto<NewsItemDto> { }


