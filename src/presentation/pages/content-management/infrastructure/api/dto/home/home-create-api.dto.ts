import { PlatformDto } from '@shared/data/dto/platform.dto';

export interface HomeCreateApiDto {
    image_file: File | string;
    platforms: PlatformDto[];
    start_date: string;
    end_date: string;
    title: string;
    resume: string;
    content: string;
    button_label?: string;
    button_url?: string;
}
