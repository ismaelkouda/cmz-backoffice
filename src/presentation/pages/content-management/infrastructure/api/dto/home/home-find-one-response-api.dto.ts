import { PlatformDto } from '@shared/data/dto/platform.dto';
import { SimpleResponseDto } from '@shared/data/dto/simple-response.dto';

export interface HomeFindOneItemApiDto {
    id: string;
    title: string;
    resume: string;
    image_url: string;
    order: number;
    platforms: PlatformDto[];
    content: string;
    time_duration_in_seconds: number;
    button_label: string;
    button_url: string;
    is_active: boolean;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
}

export type HomeFindOneResponseApiDto =
    SimpleResponseDto<HomeFindOneItemApiDto>;
