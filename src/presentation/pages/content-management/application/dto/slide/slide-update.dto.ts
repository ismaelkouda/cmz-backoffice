import { Platform } from '@shared/domain/enums/platform.enum';

export interface SlideUpdateDto {
    uniqId: string;
    timeDuration: string;
    type: string;
    image: string;
    video: string;
    platforms: Platform[];
    startDate: string;
    endDate: string;
    title: string;
    subtitle: string;
    content: string;
    buttonLabel?: string;
    buttonUrl?: string;
}
