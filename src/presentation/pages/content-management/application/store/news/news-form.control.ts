import { FormControl } from '@angular/forms';
import { MediaValue } from '@shared/domain/types/media.types';

export interface NewsFormControl {
    type: FormControl<string>;
    image: FormControl<MediaValue | null>;
    video: FormControl<string>;
    category: FormControl<string>;
    subCategory: FormControl<string>;
    hashtags: FormControl<string[]>;
    title: FormControl<string>;
    resume: FormControl<string>;
    content: FormControl<string>;
}
