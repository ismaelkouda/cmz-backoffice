import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export interface SlideCreateProps {
    timeDuration: number;
    type: string;
    image: File | null | string;
    video: string | null;
    platforms: string[];
    period: DatePeriod;
    title: string;
    subtitle: string;
    content: string;
    buttonLabel?: string;
    buttonUrl?: string;
}
