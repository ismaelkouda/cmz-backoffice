import { AbstractControl } from "@angular/forms";

export interface notificationsCenterFilterInterface {
    numero_demande: AbstractControl<string>;
    notification: AbstractControl<string>;
    date_debut: AbstractControl<string>;
    date_fin: AbstractControl<string>;
}

