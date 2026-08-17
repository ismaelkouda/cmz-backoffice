import { FormControl } from '@angular/forms';
import { ReportType } from '@shared/domain/enums/report-type.enum';

export interface EvaluateFilterControl {
    uniqId: FormControl<string>;
    initiatorPhoneNumber: FormControl<string>;
    startDate: FormControl<Date | undefined>;
    endDate: FormControl<Date | undefined>;
    reportType: FormControl<ReportType | null>;
    operators: FormControl<string[]>;
    source: FormControl<string | null>;
}
