import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export interface DepartmentsFilterProps {
    search: string | null;
    region: string | null;
    period: DatePeriod | null;
}
