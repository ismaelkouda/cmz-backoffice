import { FormControl } from '@angular/forms';
import { Status } from '@presentation/pages/team-organization/domain/enums/teams/teams-status.enum';

export interface TeamsFilterControl {
    search: FormControl<string | undefined>;
    member: FormControl<string | undefined>;
    status: FormControl<Status | undefined>;
}
