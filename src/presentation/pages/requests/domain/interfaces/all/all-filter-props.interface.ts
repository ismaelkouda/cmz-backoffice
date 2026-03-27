import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export interface AllFilterProps {
    initiatorPhoneNumber?: string;
    uniqId?: string;
    reportType?: string;
    operators?: string[];
    status?: string;
    source?: string;
    period?: DatePeriod;
}
