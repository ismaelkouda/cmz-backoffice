import { FormControl } from '@angular/forms';

export interface TeamsParticipantsReassignControl {
    uniqId: FormControl<string | undefined>;
    participants: FormControl<string[] | undefined>;
}
