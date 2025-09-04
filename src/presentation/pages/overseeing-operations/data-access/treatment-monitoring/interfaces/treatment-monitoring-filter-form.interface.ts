import { FormControl } from '@angular/forms';

export interface TreatmentMonitoringFilterFormInterface {
    operation: FormControl<string>;
    date_debut: FormControl<string>;
    date_fin: FormControl<string>;
    numero_demande: FormControl<string>;
    statut: FormControl<string>;
    traitement: FormControl<string>;
    nom_tenant: FormControl<string>;
    initie_par: FormControl<string>;
}
