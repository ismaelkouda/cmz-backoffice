import { Platform } from '@shared/domain/enums/platform.enum';

export interface HomeUpdateProps {
    uniqId: string;
    image: File | null | string;
    platforms: Platform[];
    startDate: Date | null;
    endDate: Date | null;
    title: string;
    resume: string;
    content: string;
    buttonLabel?: string;
    buttonUrl?: string;
}
