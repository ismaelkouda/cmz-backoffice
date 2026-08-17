import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export interface RegionsFilterProps {
    search: string | null;
    period: DatePeriod | null;
}
