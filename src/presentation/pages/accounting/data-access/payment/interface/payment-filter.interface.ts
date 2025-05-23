import { AbstractControl } from '@angular/forms';

export interface paymentFilterInterface {
    operation: AbstractControl<string>;
    etat_paiement: AbstractControl<string>;
    initie_par: AbstractControl<string>;
    numero_demande: AbstractControl<string>;
    date_debut: AbstractControl<string>;
    date_fin: AbstractControl<string>;
}
