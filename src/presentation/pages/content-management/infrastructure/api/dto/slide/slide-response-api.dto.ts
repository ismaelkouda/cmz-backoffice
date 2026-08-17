import { PlatformDto } from '@shared/data/dto/platform.dto';
import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface SlideItemApiDto {
    id: string;
    type: string;
    title: string;
    subtitle: string;
    order: number;
    platforms: PlatformDto[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type SlideResponseApiDto = PaginatedResponseDto<SlideItemApiDto>;
