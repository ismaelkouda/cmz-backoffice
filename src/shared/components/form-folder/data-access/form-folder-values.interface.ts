import { AbstractControl } from '@angular/forms';

export interface IFormFolderValues {
    formule_uuid: AbstractControl<string>;
    usage_id: AbstractControl<string | number>;
    montant_formule: AbstractControl<number>;
    description: AbstractControl<string>;
    accepte: AbstractControl<string>;
    commentaire: AbstractControl<string>;
    sims_file: AbstractControl<File | null>;
    commentaire_traitement: AbstractControl<string>;
    commentaire_finalisation: AbstractControl<string>;
    commentaire_cloture: AbstractControl<string>;
    notation_cloture: AbstractControl<string>;
    operation: AbstractControl<string>;
    nb_demande_soumises: AbstractControl<number>;
    prix_unitaire: AbstractControl<number>;
    prix_ht: AbstractControl<number>;
    prix_ttc: AbstractControl<number>;
    justificatif: AbstractControl<File | null>;
}
