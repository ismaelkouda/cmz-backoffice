import { AbstractControl } from '@angular/forms';

export interface claimsFilterInterface {
    operation: AbstractControl<string>;
    reference: AbstractControl<string>;
    statut: AbstractControl<string>;
    traitement: AbstractControl<string>;
    initie_par: AbstractControl<string>;
    date_debut: AbstractControl<string>;
    date_fin: AbstractControl<string>;
}
