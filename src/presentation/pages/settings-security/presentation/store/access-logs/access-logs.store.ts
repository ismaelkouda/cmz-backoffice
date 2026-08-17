import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AccessLogsFilterDto } from '@presentation/pages/settings-security/application/dto/access-logs/access-logs-filter.dto';
import { AccessLogsFacade } from '@presentation/pages/settings-security/application/services/access-logs/access-logs.facade';
import { AccessLogsFilterControl } from '@presentation/pages/settings-security/domain/controls/access-logs/access-logs-filter.control';
import { AccessLogsActions } from '@presentation/pages/settings-security/domain/enums/access-logs/access-logs-actions.enum';

@Injectable()
export class AccessLogsFilterStore {
    private readonly fb = inject(FormBuilder);
    public readonly facade = inject(AccessLogsFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    readonly form: FormGroup<AccessLogsFilterControl> =
        this.fb.group<AccessLogsFilterControl>({
            search: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
            action: new FormControl<AccessLogsActions | undefined>(undefined, {
                nonNullable: true,
            }),
            startDate: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
            endDate: new FormControl<string | undefined>(undefined, {
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

    get value(): AccessLogsFilterDto {
        const raw = this.form.getRawValue();

        return {
            search: raw.search,
            action: raw.action,
            startDate: raw.startDate,
            endDate: raw.endDate,
        };
    }
}
