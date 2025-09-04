import { AbstractControl } from '@angular/forms';

export interface IndividualsFilterInterface {
    date_debut: AbstractControl<string>;
    date_fin: AbstractControl<string>;
    nom_client: AbstractControl<string>;
    code_client: AbstractControl<string>;
    compte_client: AbstractControl<string>;
    statut: AbstractControl<string>;
}
