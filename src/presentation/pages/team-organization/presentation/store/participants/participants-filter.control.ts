import { FormControl } from '@angular/forms';

export interface ParticipantsFilterControl {
    search: FormControl<string | undefined>;
    status: FormControl<string | undefined>;
    role: FormControl<string | undefined>;
}
