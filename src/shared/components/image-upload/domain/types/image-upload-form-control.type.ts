import { FormGroup } from '@angular/forms';
import { HomeFormControl } from '@presentation/pages/content-management/application/store/home/home-form.control';
import { SlideFormControl } from '@pages/content-management/domain/controls/slide/slide-form.control';

export type ImageUploadFormControlType =
    | FormGroup<HomeFormControl>
    | FormGroup<SlideFormControl>
    | null;
