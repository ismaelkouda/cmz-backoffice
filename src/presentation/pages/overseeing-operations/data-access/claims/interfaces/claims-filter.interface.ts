import { AbstractControl } from "@angular/forms";

export interface claimsFilterInterface {
    operation?: string;
    imsi: AbstractControl<string>;
    msisdn: AbstractControl<string>;
    statut: AbstractControl<string>;
    initie_par: AbstractControl<string>;
    numero_demande: AbstractControl<string>;
    transaction: AbstractControl<string>;
    traitement: AbstractControl<string>;
    date_debut: AbstractControl<string>;
    date_fin: AbstractControl<string>;
}

