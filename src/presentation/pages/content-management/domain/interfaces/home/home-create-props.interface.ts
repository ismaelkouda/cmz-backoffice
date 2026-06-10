import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export interface HomeCreateProps {
    image: File | null | string;
    platforms: string[];
    period: DatePeriod;
    title: string;
    resume: string;
    content: string;
    buttonLabel?: string;
    buttonUrl?: string;
}
