import { State } from '@presentation/pages/finalization/domain/enums/all/all-state.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';

export interface AllFilterDto {
    initiatorPhoneNumber?: string;
    uniqId?: string;
    reportType?: ReportType;
    operators?: string[];
    source?: string;
    state?: State;
    startDate?: string;
    endDate?: string;
}
