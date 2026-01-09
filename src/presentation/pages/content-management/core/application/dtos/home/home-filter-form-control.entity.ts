import { FormControl } from '@angular/forms';
import { Plateform } from '@shared/domain/enums/plateform.enum';

export interface HomeFilterFormControlDto {
    startDate: FormControl<string>;
    endDate: FormControl<string>;
    plateforms: FormControl<Array<Plateform> | null>;
    search: FormControl<string>;
    status: FormControl<boolean | null>;
}
