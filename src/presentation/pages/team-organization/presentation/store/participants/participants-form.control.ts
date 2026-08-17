import { FormControl } from '@angular/forms';
import { Roles } from '@shared/domain/enums/roles.enum';

export interface ParticipantsFormControl {
    firstName: FormControl<string>;
    lastName: FormControl<string>;
    email: FormControl<string>;
    phone: FormControl<string>;
    role: FormControl<Roles | undefined>;
    team: FormControl<string | undefined>;
}
