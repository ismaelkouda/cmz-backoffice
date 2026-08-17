import { FormGroup } from '@angular/forms';
import { SlideFormControl } from '@pages/content-management/application/store/slide/slide-form.control';
import { HomeFormControl } from '@presentation/pages/content-management/application/store/home/home-form.control';

export type ImageUploadFormControlType =
    | FormGroup<HomeFormControl>
    | FormGroup<SlideFormControl>
    | null;
