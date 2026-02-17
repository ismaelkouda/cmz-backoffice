import { ReportSourceDto } from '@shared/data/dto/report-source.dto';
import { PaginatedResponseDto } from '@shared/data/dto/simple-response.dto';
import { TypeMediaDto } from '@shared/data/dto/type-media.dto';

export interface HomeItemDto {
    id: string;
    platforms: ReportSourceDto[];
    title: string;
    resume: string;
    content: string;
    type: TypeMediaDto;
    image_file: string;
    image_url: string;
    time_duration_in_seconds: number;
    video_url: string;
    order: number;
    button_label: string;
    button_url: string;
    is_active: boolean;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
}

export type HomeResponseDto = PaginatedResponseDto<HomeItemDto>;
