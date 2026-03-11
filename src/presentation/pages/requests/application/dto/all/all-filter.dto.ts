import { Status } from '@pages/requests/domain/enums/all/all-status.enum';

export interface AllFilterDto {
    initiatorPhoneNumber?: string;
    uniqId?: string;
    reportType?: string;
    operators?: string[];
    source?: string;
    status?: Status;
    startDate?: string;
    endDate?: string;
}
