import { FormControl } from '@angular/forms';
import { Status } from '@pages/content-management/domain/enums/news/news-status.enum';
export interface NewsFilterControl {
    search: FormControl<string | undefined>;
    status: FormControl<Status | undefined>;
    startDate: FormControl<string | undefined>;
    endDate: FormControl<string | undefined>;
}
