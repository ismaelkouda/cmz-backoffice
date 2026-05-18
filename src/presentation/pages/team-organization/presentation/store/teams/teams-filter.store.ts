import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TeamsFilterDto } from '@pages/team-organization/application/dto/teams/teams-filter.dto';
import { TeamsFacade } from '@pages/team-organization/application/services/teams/teams.facade';
import { Status } from '@pages/team-organization/domain/enums/teams/teams-status.enum';
import { TeamsFilterControl } from '@presentation/pages/team-organization/domain/controls/teams/teams-filter.control';

@Injectable()
export class TeamsFilterStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(TeamsFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    readonly form: FormGroup<TeamsFilterControl> =
        this.fb.group<TeamsFilterControl>({
            search: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
            status: new FormControl<Status | undefined>(undefined, {
                nonNullable: true,
            }),
            member: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
        });

    constructor() {
        const filter = this.currentFilter();

        if (!filter) {
            return;
        }

        this.form.patchValue(filter, {
            emitEvent: false,
        });
    }

    reset(): void {
        this.form.reset();
    }

    get value(): TeamsFilterDto {
        const raw = this.form.getRawValue();

        return {
            search: raw.search || undefined,
            status: raw.status || undefined,
            member: raw.member || undefined,
        };
    }
}
