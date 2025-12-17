import { FormControl } from '@angular/forms';

export interface NewsFilterFormControlDto {
    startDate: FormControl<string>;
    endDate: FormControl<string>;
    search: FormControl<string>;
    status: FormControl<boolean | null>;
}
