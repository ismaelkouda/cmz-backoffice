import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ParticipantsFilterDto } from '@pages/team-organization/application/dto/participants/participants-filter.dto';
import { ParticipantsFacade } from '@pages/team-organization/application/services/participants/participants.facade';
import { ParticipantsFilterControl } from '@pages/team-organization/presentation/store/participants/participants-filter.control';

@Injectable()
export class ParticipantsFilterStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(ParticipantsFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    readonly form: FormGroup<ParticipantsFilterControl> =
        this.fb.group<ParticipantsFilterControl>({
            search: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
            status: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
            role: new FormControl<string | undefined>(undefined, {
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

    get value(): ParticipantsFilterDto {
        const raw = this.form.getRawValue();

        return {
            search: raw.search || undefined,
            status: raw.status || undefined,
            role: raw.role || undefined,
        };
    }
}
