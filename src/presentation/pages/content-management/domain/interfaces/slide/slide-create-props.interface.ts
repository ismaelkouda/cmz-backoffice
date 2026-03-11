import { Platform } from '@shared/domain/enums/platform.enum';

export interface SlideCreateProps {
    timeDuration: number;
    type: string;
    image: File | null;
    video: string | null;
    platforms: Platform[];
    startDate: string;
    endDate: string;
    title: string;
    subtitle: string;
    content: string;
    buttonLabel?: string;
    buttonUrl?: string;
}
