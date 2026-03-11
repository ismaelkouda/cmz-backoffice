import { PlatformDto } from '@shared/data/dto/platform.dto';

export interface SlideUpdateApiDto {
    id: string;
    time_duration_in_seconds: string;
    type: string;
    image_file: string;
    video_url: string;
    platforms: PlatformDto[];
    start_date: string;
    end_date: string;
    title: string;
    subtitle: string;
    content: string;
    button_label?: string;
    button_url?: string;
}
