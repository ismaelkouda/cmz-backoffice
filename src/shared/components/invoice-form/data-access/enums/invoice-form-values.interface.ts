import { AbstractControl } from '@angular/forms';

export interface IInvoiceFormValues {
    compte_client: AbstractControl<string>;
    email_admin_client: AbstractControl<string>;
    nom_tenant: AbstractControl<string>;
    adresse: AbstractControl<string>;
    email_gerant: AbstractControl<string>;
    contact_gerant: AbstractControl<string>;
    nom_gerant: AbstractControl<string>;
    nb_demande_soumises: AbstractControl<number>;
    fichier_rccm: AbstractControl<File | null>;
    fichier_dfe: AbstractControl<File | null>;
    piece_gerant: AbstractControl<File | null>;

    prix_unitaire: AbstractControl<number>;
    prix_ht: AbstractControl<number>;
    prix_ttc: AbstractControl<number>;

    commentaire: AbstractControl<string>;
    commentaire_traitement: AbstractControl<string>;
    commentaire_finalisation: AbstractControl<string>;
    commentaire_cloture: AbstractControl<string>;
    notation_cloture: AbstractControl<string>;

    accepte: AbstractControl<string>;
}
