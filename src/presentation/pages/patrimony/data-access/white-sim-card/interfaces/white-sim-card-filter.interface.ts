import { AbstractControl } from '@angular/forms';

export interface whiteSimCardFilterInterface {
    numero_demande: AbstractControl<string>;
    iccid: AbstractControl<string>;
    msisdn: AbstractControl<string>;
    imsi: AbstractControl<string>;
    statut: AbstractControl<string>;
    date_debut: AbstractControl<string>;
    date_fin: AbstractControl<string>;
}
