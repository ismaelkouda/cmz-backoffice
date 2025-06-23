import { AbstractControl } from '@angular/forms';

export interface IFormDemandValues {
    source: AbstractControl<string>;
    operation: AbstractControl<string>;
    niveau_un_uuid: AbstractControl<string>;
    niveau_deux_uuid: AbstractControl<string>;
    niveau_trois_uuid: AbstractControl<string>;
    usage_id: AbstractControl<string | null>;
    nb_demandes: AbstractControl<number>;
    point_emplacement: AbstractControl<string>;
    adresse_geographique: AbstractControl<string>;
    adresse_email: AbstractControl<string>;
    longitude: AbstractControl<string>;
    latitude: AbstractControl<string>;
    formule_uuid: AbstractControl<string | null>;
    description: AbstractControl<string>;
    montant: AbstractControl<number>;
    justificatif: AbstractControl<File | null>;
    sims_file: AbstractControl<File | null>;
    confirmation_contrat: AbstractControl<boolean | null>;
}
