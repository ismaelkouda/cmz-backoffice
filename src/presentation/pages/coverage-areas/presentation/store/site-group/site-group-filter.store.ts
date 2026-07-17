import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Status } from '@pages/coverage-areas/domain/enums/site-group/site-group-status.enum';
import { SiteGroupFilterDto } from '@pages/coverage-areas/application/dto/site-group/site-group-filter.dto';
import { SiteGroupFacade } from '@pages/coverage-areas/application/services/site-group/site-group.facade';
import { SiteGroupFilterControl } from '@pages/coverage-areas/presentation/store/site-group/site-group-filter.control';

@Injectable()
export class SiteGroupFilterStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(SiteGroupFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    readonly form: FormGroup<SiteGroupFilterControl> =
        this.fb.group<SiteGroupFilterControl>({
            search: new FormControl<string | undefined>(undefined, {
                nonNullable: true,
            }),
            status: new FormControl<Status | undefined>(undefined, {
                nonNullable: true,
            }),
            startDate: new FormControl<Date | undefined>(undefined, {
                nonNullable: true,
            }),

            endDate: new FormControl<Date | undefined>(undefined, {
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

    get value(): SiteGroupFilterDto {
        const raw = this.form.getRawValue();

        return {
            search: raw.search || undefined,
            status: raw.status || undefined,
            startDate: raw.startDate || undefined,
            endDate: raw.endDate || undefined,
        };
    }
}
