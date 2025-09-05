import { FormControl } from '@angular/forms';

export interface SlaContactsFormInterface {
    nom_tenant: FormControl<string>;
    adresse: FormControl<string>;
    email_diffusion_tenant: FormControl<string>;

    gestionnaire_tenant_id: FormControl<string>;
    contact_gestionnaire_tenant: FormControl<string>;
    email_gestionnaire_tenant: FormControl<string>;

    admin_tenant_id: FormControl<string>;
    contact_admin_tenant: FormControl<string>;
    email_admin_tenant: FormControl<string>;

    escalade_tenant_id: FormControl<string>;
    contact_escalade_tenant: FormControl<string>;
    email_escalade_tenant: FormControl<string>;

    nom_gerant: FormControl<string>;
    contact_gerant: FormControl<string>;
    email_gerant: FormControl<string>;

    piece_gerant: FormControl<File | null>;

    numero_rccm: FormControl<string | null>;
    forme_juridique_code: FormControl<string | null>;
    fichier_rccm: FormControl<File | null>;

    numero_cc: FormControl<string | null>;
    regime_code: FormControl<string | null>;
    centre: FormControl<string | null>;
    fichier_dfe: FormControl<File | null>;

    description: FormControl<string>;
}
