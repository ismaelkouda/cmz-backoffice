import { FormControl } from '@angular/forms';
import { Platform } from '@shared/domain/enums/platform.enum';

export interface HomeFormControl {
    title: FormControl<string>;
    resume: FormControl<string>;
    content: FormControl<string>;
    image: FormControl<File | null>;
    buttonLabel: FormControl<string>;
    buttonUrl: FormControl<string>;
    platforms: FormControl<Platform[]>;
    startDate: FormControl<string>;
    endDate: FormControl<string>;
}
