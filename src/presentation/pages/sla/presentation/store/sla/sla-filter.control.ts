import { FormControl } from '@angular/forms';

export interface SlaFilterControl {
    search: FormControl<string | null>;
    category: FormControl<string | null>;
}
