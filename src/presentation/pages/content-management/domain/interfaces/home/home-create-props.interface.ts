import { Platform } from '@shared/domain/enums/platform.enum';

export interface HomeCreateProps {
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
