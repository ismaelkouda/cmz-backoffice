import { FormControl } from '@angular/forms';

export interface TeamFilterFormInterface {
    code_nom: FormControl<string>;
    participant_id: FormControl<string>;
    nom_tenant: FormControl<string>;
    statut: FormControl<string>;
}
