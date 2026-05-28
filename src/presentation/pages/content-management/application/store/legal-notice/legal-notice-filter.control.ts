import { FormControl } from '@angular/forms';
import { Status } from '@presentation/pages/content-management/domain/enums/legal-notice/legal-notice-status.enum';

export interface LegalNoticeFilterControl {
    search: FormControl<string | undefined>;
    version: FormControl<string | undefined>;
    status: FormControl<Status | undefined>;
    startDate: FormControl<string | undefined>;
    endDate: FormControl<string | undefined>;
}
