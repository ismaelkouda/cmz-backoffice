import { Status } from '@pages/administrative-boundary/domain/enums/regions/regions-status.enum';
import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

export interface RegionsFilterProps {
    search?: string;
    department?: string;
    municipality?: string;
    status?: Status;
    period?: DatePeriod;
}
