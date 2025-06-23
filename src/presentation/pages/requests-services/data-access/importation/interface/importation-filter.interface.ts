import { AbstractControl } from '@angular/forms';

export interface ImportationFilterInterface {
    operation?: string;
    imsi: AbstractControl<string>;
    msisdn: AbstractControl<string>;
    statut: AbstractControl<string>;
    initie_par: AbstractControl<string>;
    numero_demande: AbstractControl<string>;
    // nb_demande_soumises: AbstractControl<number>;
    traitement: AbstractControl<string>;
    date_debut: AbstractControl<string>;
    date_fin: AbstractControl<string>;
}
