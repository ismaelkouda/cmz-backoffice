import { FormControl } from '@angular/forms';
import { State } from '@presentation/pages/processing/domain/enums/all/all-state.enum';
import { ReportType } from '@shared/domain/enums/report-type.enum';

export interface AllFilterControl {
    uniqId: FormControl<string>;
    initiatorPhoneNumber: FormControl<string>;
    startDate: FormControl<string>;
    endDate: FormControl<string>;
    reportType: FormControl<ReportType | null>;
    state: FormControl<State | null>;
    operators: FormControl<string[]>;
    source: FormControl<string | null>;
}
