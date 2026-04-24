import { Status } from '@pages/administrative-boundary/domain/enums/municipalities/municipalities-status.enum';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';
export interface MunicipalitiesByDepartmentIdFilterProps {
    uniqId: string;
    search?: string;
    region?: string;
    department?: string;
    status?: Status;
    period?: DatePeriod;
}
