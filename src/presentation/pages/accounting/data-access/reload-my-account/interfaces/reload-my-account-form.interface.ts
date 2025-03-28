import { AbstractControl } from "@angular/forms";
import { T_MODE_PAYMENT } from "../types/mode-payment.type";

export interface reloadMyAccountFormInterface {
    mode_paiement: AbstractControl<T_MODE_PAYMENT>;
    code_banque: AbstractControl<string>;
    reference: AbstractControl<string>;
    montant: AbstractControl<string>;
    titulaire: AbstractControl<string>;
    numero: AbstractControl<string>;
    password: AbstractControl<string>;
    date_remise: AbstractControl<string>;
    justificatif: AbstractControl<File | null>;
}
