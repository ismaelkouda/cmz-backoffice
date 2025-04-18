import { AbstractControl } from '@angular/forms';

export interface reloadMyAccountFilterInterface {
    transaction: AbstractControl<string>;
    statut: AbstractControl<string>;
    date_debut: AbstractControl<string>;
    date_fin: AbstractControl<string>;
}
