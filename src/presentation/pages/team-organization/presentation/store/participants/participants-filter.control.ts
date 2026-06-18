import { FormControl } from '@angular/forms';
import { Roles } from '@shared/domain/enums/roles.enum';

export interface ParticipantsFilterControl {
    search: FormControl<string | undefined>;
    status: FormControl<string | undefined>;
    role: FormControl<Roles | undefined>;
    team: FormControl<string | undefined>;
}
