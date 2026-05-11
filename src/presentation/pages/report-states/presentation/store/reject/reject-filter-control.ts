import { FormControl } from '@angular/forms';
import { Status } from '@pages/report-states/domain/enums/reject/reject-status.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';

export interface RejectFilterControl {
    uniqId: FormControl<string>;
    initiatorPhoneNumber: FormControl<string>;
    startDate: FormControl<string>;
    endDate: FormControl<string>;
    reportType: FormControl<ReportType | null>;
    status: FormControl<Status | null>;
    operators: FormControl<string[]>;
    source: FormControl<string | null>;
}
