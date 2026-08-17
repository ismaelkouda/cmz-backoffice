import { ReportType } from '@shared/domain/enums/report-type.enum';

export interface ApproveFilterProps {
    initiatorPhoneNumber?: string;
    uniqId?: string;
    reportType?: ReportType;
    operators?: string[];
    source?: string;
    startDate?: string;
    endDate?: string;
}
