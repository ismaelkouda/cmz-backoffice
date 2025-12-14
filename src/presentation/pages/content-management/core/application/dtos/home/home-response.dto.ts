import { ReportSourceDto } from '@shared/data/dtos/report-source.dto';
import { PaginatedResponseDto } from '@shared/data/dtos/simple-response.dto';
import { TypeMediaDto } from '@shared/data/dtos/type-media.dto';

export interface HomeItemDto {
    id: string;
    platforms: Array<ReportSourceDto>;
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

export interface HomeResponseDto extends PaginatedResponseDto<HomeItemDto> { }


