import { AbstractControl } from '@angular/forms';

export interface historyFilterInterface {
    module?: string;
    typeModel?: string;
    idModel?: number;
    initie_par: AbstractControl<number>;
    date_debut: AbstractControl<string>;
    date_fin: AbstractControl<string>;
}
