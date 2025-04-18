import { AbstractControl } from '@angular/forms';
import { T_MODE_PAYMENT } from '../types/mode-payment.type';

export interface reloadMyAccountFormInterface {
    mode_paiement: AbstractControl<T_MODE_PAYMENT>;
    code_banque_beneficiaire: AbstractControl<string>;
    code_agence_beneficiaire: AbstractControl<string>;
    code_banque_tireur: AbstractControl<string>;
    numero_cheque: AbstractControl<string>;
    reference: AbstractControl<string>;
    montant: AbstractControl<string>;
    prenom_deposant: AbstractControl<string>;
    contact_deposant: AbstractControl<string>;
    nom_tireur: AbstractControl<string>;
    nom_deposant: AbstractControl<string>;
    date_remise: AbstractControl<string>;
    piece_jointe_bordereau: AbstractControl<File | null>;
}
