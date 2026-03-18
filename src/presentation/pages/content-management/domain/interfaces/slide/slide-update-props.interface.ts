import { Platform } from '@shared/domain/enums/platform.enum';

export interface SlideUpdateProps {
    uniqId: string;
    timeDuration: number;
    type: string;
    image: File | null;
    video: string | null;
    platforms: Platform[];
    startDate: Date | null;
    endDate: Date | null;
    title: string;
    subtitle: string;
    content: string;
    buttonLabel?: string;
    buttonUrl?: string;
}
