import { FormControl } from '@angular/forms';

export interface CustomersActivateFormInterface {
    type_entreprise: FormControl<string>;
    nom_client: FormControl<string>;
    adresse: FormControl<string>;
    compte_client: FormControl<string>;
    email_admin_client: FormControl<string>;
    domaine_activite: FormControl<string>;
    logo_client: FormControl<File | null>;

    nom_gerant: FormControl<string>;
    contact_gerant: FormControl<string>;
    email_gerant: FormControl<string>;
    piece_gerant: FormControl<File | null>;

    numero_rccm: FormControl<string>;
    forme_juridique_code: FormControl<string | null>;
    fichier_rccm: FormControl<File | null>;

    numero_cc: FormControl<string>;
    regime_code: FormControl<string | null>;
    centre: FormControl<string>;
    fichier_dfe: FormControl<File | null>;

    description: FormControl<string>;
}
