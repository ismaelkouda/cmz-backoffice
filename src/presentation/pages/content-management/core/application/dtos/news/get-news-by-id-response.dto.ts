import { SimpleResponseDto } from '@shared/data/dtos/simple-response.dto';
import { TypeMediaDto } from '@shared/data/dtos/type-media.dto';
import { CategoryItemDto, SubCategoryItemDto } from './category-response.dto';

export interface GetNewsByIdResponseDto
    extends SimpleResponseDto<GetNewsByIdItemDto> {}

export interface GetNewsByIdItemDto {
    title: string;
    resume: string;
    content: string;
    type: TypeMediaDto;
    category: CategoryItemDto;
    sub_category: SubCategoryItemDto | null;
    hashtags: string[];
    image_url: string | null;
    video_url: string | null;
    is_published: boolean;
}
