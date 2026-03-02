import { Platform } from '@shared/domain/enums/platform.enum';

export interface HomeUpdateDto {
    uniqId: string;
    image: string;
    platforms: Platform[];
    startDate: string;
    endDate: string;
    title: string;
    resume: string;
    content: string;
    buttonLabel?: string;
    buttonUrl?: string;
}
