import { PlatformDto } from '@shared/data/dto/platform.dto';
import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';

export interface HomeItemApiDto {
    id: string;
    title: string;
    resume: string;
    image_url: string;
    order: number;
    platforms: PlatformDto[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export type HomeResponseApiDto = PaginatedResponseDto<HomeItemApiDto>;
