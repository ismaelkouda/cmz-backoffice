import { AbstractControl } from "@angular/forms";

export interface whiteSimCardDetailsFilterInterface {
    imsi: AbstractControl<string>;
    iccid: AbstractControl<string>;
    statut: AbstractControl<string>;
    date_debut: AbstractControl<string>;
    date_fin: AbstractControl<string>;
}
