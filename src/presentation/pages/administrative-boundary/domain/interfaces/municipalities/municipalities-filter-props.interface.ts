import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';
export interface MunicipalitiesFilterProps {
    search: string | null;
    region: string | null;
    department: string | null;
    period: DatePeriod | null;
}
