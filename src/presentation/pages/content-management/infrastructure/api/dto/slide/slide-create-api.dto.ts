import { PlatformDto } from '@shared/data/dto/platform.dto';

export interface SlideCreateApiDto {
    time_duration_in_seconds: number;
    type: string;
    image_file: File | string;
    video_url: string | null;
    platforms: PlatformDto[];
    start_date: string;
    end_date: string;
    title: string;
    subtitle: string;
    content: string;
    button_label?: string;
    button_url?: string;
}
