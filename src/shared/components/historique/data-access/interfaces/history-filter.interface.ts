import { AbstractControl } from "@angular/forms";

export interface historyFilterInterface {
    user_id: AbstractControl<number>;
    date_debut: AbstractControl<string>;
    date_fin: AbstractControl<string>;
}
