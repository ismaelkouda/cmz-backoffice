import { FormControl } from '@angular/forms';

export interface TeamsParticipantsFilterControl {
    search: FormControl<string | undefined>;
    participantEmail: FormControl<string | undefined>;
    phone: FormControl<string | undefined>;
}
