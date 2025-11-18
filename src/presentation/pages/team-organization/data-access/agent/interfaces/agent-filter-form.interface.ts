import { FormControl } from '@angular/forms';

export interface AgentFilterFormInterface {
    code_nom: FormControl<string>;
    statut: FormControl<string>;
}

