import { FormArray, FormControl } from '@angular/forms';

export interface NewsFormControl {
    type: FormControl<string>;
    title: FormControl<string>;
    resume: FormControl<string>;
    content: FormControl<string>;
    image: FormControl<File | null>;
    video: FormControl<string>;
    hashtags: FormArray;
    category: FormControl<string>;
    subCategory: FormControl<string>;
}
