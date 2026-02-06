import { FormControl } from '@angular/forms';

export interface TeamsParticipantsAssignControl {
    uniqId: FormControl<string | undefined>;
    participants: FormControl<string[] | undefined>;
}
