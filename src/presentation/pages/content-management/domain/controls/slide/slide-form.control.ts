import { FormControl } from '@angular/forms';
import { Platform } from '@shared/domain/enums/platform.enum';

export interface SlideFormControl {
    timeDuration: FormControl<number>;
    type: FormControl<string>;
    title: FormControl<string>;
    subtitle: FormControl<string>;
    content: FormControl<string>;
    image: FormControl<File | null>;
    video: FormControl<string>;
    buttonLabel: FormControl<string>;
    buttonUrl: FormControl<string>;
    platforms: FormControl<Platform[]>;
    startDate: FormControl<string>;
    endDate: FormControl<string>;
}
