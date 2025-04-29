import { AbstractControl } from '@angular/forms';

export interface historyFilterInterface {
    initie_par: AbstractControl<number>;
    date_debut: AbstractControl<string>;
    date_fin: AbstractControl<string>;
}
