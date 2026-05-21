import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { RegionsFilterDto } from '@pages/administrative-boundary/application/dto/regions/regions-filter.dto';
import { RegionsFacade } from '@pages/administrative-boundary/application/services/regions/regions.facade';
import { RegionsFilterControl } from '@presentation/pages/administrative-boundary/application/store/regions/regions-filter.control';

@Injectable()
export class RegionsFilterStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(RegionsFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    readonly form: FormGroup<RegionsFilterControl> =
        this.fb.group<RegionsFilterControl>({
            search: new FormControl<string | null>(null),
            startDate: new FormControl<string | null>(null),
            endDate: new FormControl<string | null>(null),
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

    get value(): RegionsFilterDto {
        const raw = this.form.getRawValue();

        return {
            search: raw.search,
            startDate: raw.startDate,
            endDate: raw.endDate,
        };
    }
}
