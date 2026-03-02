import { DatePeriod } from '@shared/domain/value-objects/date-period.vo';

import { Status } from '@presentation/pages/requests/domain/enums/all/all-status.enum';
export interface AllFilterProps {
    initiatorPhoneNumber?: string;
    uniqId?: string;
    reportType?: string;
    operators?: string[];
    status?: Status;
    source?: string;
    period?: DatePeriod;
}
