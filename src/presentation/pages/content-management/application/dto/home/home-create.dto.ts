import { Platform } from '@shared/domain/enums/platform.enum';

export interface HomeCreateDto {
    image: File | null;
    platforms: Platform[];
    startDate: string;
    endDate: string;
    title: string;
    resume: string;
    content: string;
    buttonLabel?: string;
    buttonUrl?: string;
}
