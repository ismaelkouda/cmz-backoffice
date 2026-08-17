import { FormControl } from '@angular/forms';
import { ReportType } from '@shared/domain/enums/report-type.enum';

export interface CloseFilterControl {
    uniqId: FormControl<string | null>;
    initiatorPhoneNumber: FormControl<string | null>;
    startDate: FormControl<Date | undefined>;
    endDate: FormControl<Date | undefined>;
    reportType: FormControl<ReportType | null>;
    operators: FormControl<string[]>;
    source: FormControl<string | null>;
}
