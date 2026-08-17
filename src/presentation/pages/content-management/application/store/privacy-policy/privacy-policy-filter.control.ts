import { FormControl } from '@angular/forms';
import { Status } from '@presentation/pages/content-management/domain/enums/privacy-policy/privacy-policy-status.enum';

export interface PrivacyPolicyFilterControl {
    search: FormControl<string | undefined>;
    version: FormControl<string | undefined>;
    status: FormControl<Status | undefined>;
    startDate: FormControl<string | undefined>;
    endDate: FormControl<string | undefined>;
}
