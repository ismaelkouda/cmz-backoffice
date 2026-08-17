import { FormControl } from '@angular/forms';
import { Status } from '@pages/content-management/domain/enums/slide/slide-status.enum';
import { Platform } from '@shared/domain/enums/platform.enum';
export interface SlideFilterControl {
    search: FormControl<string | undefined>;
    platforms: FormControl<Platform[] | undefined>;
    status: FormControl<Status | undefined>;
    startDate: FormControl<string | undefined>;
    endDate: FormControl<string | undefined>;
}
