import { AbstractControl } from '@angular/forms';

export interface invoiceFilterInterface {
    operation: AbstractControl<string>;
    statut: AbstractControl<string>;
    type_paiement: AbstractControl<string>;
    initie_par: AbstractControl<string>;
    numero_demande: AbstractControl<string>;
    date_debut: AbstractControl<string>;
    date_fin: AbstractControl<string>;
}
