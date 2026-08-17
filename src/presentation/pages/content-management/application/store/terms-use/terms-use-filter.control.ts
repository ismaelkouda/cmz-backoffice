import { FormControl } from '@angular/forms';
import { Status } from '@presentation/pages/content-management/domain/enums/terms-use/terms-use-status.enum';

export interface TermsUseFilterControl {
    search: FormControl<string | undefined>;
    version: FormControl<string | undefined>;
    status: FormControl<Status | undefined>;
    startDate: FormControl<string | undefined>;
    endDate: FormControl<string | undefined>;
}
