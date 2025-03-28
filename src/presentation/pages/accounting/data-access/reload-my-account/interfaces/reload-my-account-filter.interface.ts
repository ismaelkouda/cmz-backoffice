import { AbstractControl } from "@angular/forms";

export interface reloadMyAccountFilterInterface {
    transaction: AbstractControl<string>;
    reference: AbstractControl<string>;
    date_debut: AbstractControl<string>;
    date_fin: AbstractControl<string>;
}
