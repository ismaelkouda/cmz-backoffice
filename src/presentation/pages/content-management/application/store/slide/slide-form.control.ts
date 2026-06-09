import { FormControl } from '@angular/forms';
import { MediaValue } from '@shared/domain/types/media.types';

export interface SlideFormControl {
    timeDuration: FormControl<number>;
    order: FormControl<number>;
    type: FormControl<string>;
    title: FormControl<string>;
    subtitle: FormControl<string>;
    content: FormControl<string>;
    image: FormControl<MediaValue | null>;
    video: FormControl<string>;
    buttonLabel: FormControl<string>;
    buttonUrl: FormControl<string>;
    platforms: FormControl<string[]>;
    startDate: FormControl<Date | null>;
    endDate: FormControl<Date | null>;
}
