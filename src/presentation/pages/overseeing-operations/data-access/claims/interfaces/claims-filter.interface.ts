import { AbstractControl } from "@angular/forms";

export interface claimsFilterInterface {
    initie_par: AbstractControl<string>;
    numero_demande: AbstractControl<string>;
    operation: AbstractControl<string>;
    date_debut: AbstractControl<string>;
    date_fin: AbstractControl<string>;
}

