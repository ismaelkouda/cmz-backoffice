import { PlatformDto } from '@shared/data/dto/platform.dto';

export interface SlideCreateApiDto {
    time_duration_in_seconds: number;
    type: string;
    image_file: File | null;
    video_url: string | null;
    platforms: PlatformDto[];
    start_date: Date;
    end_date: Date;
    title: string;
    subtitle: string;
    content: string;
    button_label?: string;
    button_url?: string;
}
