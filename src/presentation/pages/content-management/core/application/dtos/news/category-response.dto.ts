import { PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';

export interface SubCategoryItemDto {
    id: number;
    name: string;
    icon: string | null;
    color: string;
    background_color: string;
    description: string | null;
}

export interface CategoryItemDto {
    id: number;
    name: string;
    icon: string;
    color: string;
    background_color: string;
    description: string;
    sub_categories: SubCategoryItemDto[];
}

export interface CategoryResponseDto
    extends PaginatedResponseDto<CategoryItemDto> {}
