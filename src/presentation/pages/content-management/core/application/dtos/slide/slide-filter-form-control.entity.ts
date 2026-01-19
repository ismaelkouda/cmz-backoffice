import { FormControl } from '@angular/forms';
import { Plateform } from '@shared/domain/enums/plateform.enum';

export interface SlideFilterFormControlDto {
    startDate: FormControl<string>;
    endDate: FormControl<string>;
    platforms: FormControl<Array<Plateform>>;
    search: FormControl<string>;
    status: FormControl<boolean | null>;
}
