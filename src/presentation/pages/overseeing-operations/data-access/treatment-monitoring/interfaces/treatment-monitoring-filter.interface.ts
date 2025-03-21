import { AbstractControl } from "@angular/forms";

export interface treatmentMonitoringFilterInterface {
    initie_par: AbstractControl<string>;
    operation: AbstractControl<string>;
    numero_demande: AbstractControl<string>;
    msisdn: AbstractControl<string>;
    imsi: AbstractControl<string>;
    statut: AbstractControl<string>;
    traitement: AbstractControl<string>;
    date_debut: AbstractControl<string>;
    date_fin: AbstractControl<string>;
}

