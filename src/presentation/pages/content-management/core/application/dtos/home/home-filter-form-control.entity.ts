import { FormControl } from '@angular/forms';
import { TypeMediaDto } from '@shared/data/dtos/type-media.dto';

export interface HomeFilterFormControlDto {
    createdFrom: FormControl<string>;
    createdTo: FormControl<string>;
    type: FormControl<Array<TypeMediaDto>>;
    status: FormControl<boolean | null>;
}
