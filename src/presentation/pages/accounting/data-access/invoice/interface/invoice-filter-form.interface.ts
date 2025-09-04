import { FormControl } from '@angular/forms';

export interface InvoiceFilterFormInterface {
    date_debut: FormControl<string>;
    date_fin: FormControl<string>;
    numero_demande: FormControl<string>;
    reference: FormControl<string>;
    statut: FormControl<string>;
    operation: FormControl<string>;
}
