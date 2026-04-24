import { Status } from '@pages/administrative-boundary/domain/enums/departments/departments-status.enum';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export interface DepartmentsFilterProps {
    search?: string;
    region?: string;
    municipality?: string;
    status?: Status;
    period?: DatePeriod;
}
