import { FormControl } from '@angular/forms';
import { ReportType } from '@shared/domain/enums/report-type.enum';

export interface TasksFilterControl {
    uniqId: FormControl<string | null>;
    initiatorPhoneNumber: FormControl<string | null>;
    startDate: FormControl<string | null>;
    endDate: FormControl<string | null>;
    reportType: FormControl<ReportType | null>;
    operators: FormControl<string[]>;
    source: FormControl<string | null>;
}
