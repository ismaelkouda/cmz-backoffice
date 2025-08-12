import { AbstractControl } from '@angular/forms';

export interface myAccountFilterInterface {
    type: AbstractControl<string>;
    reference: AbstractControl<string>;
    date_debut: AbstractControl<string>;
    date_fin: AbstractControl<string>;
}
