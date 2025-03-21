import { AbstractControl } from "@angular/forms";

export interface waitingQueueFilterInterface {
    initie_par: AbstractControl<string>;
    operation: AbstractControl<string>;
    numero_demande: AbstractControl<string>;
    date_debut: AbstractControl<string>;
    date_fin: AbstractControl<string>;
}

