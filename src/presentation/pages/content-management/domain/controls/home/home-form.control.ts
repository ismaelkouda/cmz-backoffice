import { FormControl } from '@angular/forms';
import { MediaValue } from '@shared/domain/types/media.types';

export interface HomeFormControl {
    title: FormControl<string>;
    resume: FormControl<string>;
    content: FormControl<string>;
    image: FormControl<MediaValue | null>;
    buttonLabel: FormControl<string>;
    buttonUrl: FormControl<string>;
    platforms: FormControl<string[]>;
    startDate: FormControl<Date | null>;
    endDate: FormControl<Date | null>;
}
