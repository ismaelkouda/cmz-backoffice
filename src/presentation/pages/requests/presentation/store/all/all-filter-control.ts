import { FormControl } from '@angular/forms';
import { Status } from '@pages/requests/domain/enums/all/all-status.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';

export interface AllFilterControl {
    uniqId: FormControl<string>;
    initiatorPhoneNumber: FormControl<string>;
    startDate: FormControl<string>;
    endDate: FormControl<string>;
    reportType: FormControl<ReportType | null>;
    status: FormControl<Status | null>;
    operators: FormControl<string[]>;
    source: FormControl<string | null>;
}
