import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DepartmentsFilterDto } from '@pages/administrative-boundary/application/dto/departments/departments-filter.dto';
import { DepartmentsFacade } from '@pages/administrative-boundary/application/services/departments/departments.facade';
import { DepartmentsFilterControl } from '@presentation/pages/administrative-boundary/application/store/departments/departments-filter.control';

@Injectable()
export class DepartmentsFilterStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(DepartmentsFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    readonly form: FormGroup<DepartmentsFilterControl> =
        this.fb.group<DepartmentsFilterControl>({
            search: new FormControl<string | null>(null),
            region: new FormControl<string | null>(null),
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

    get value(): DepartmentsFilterDto {
        const raw = this.form.getRawValue();

        return {
            search: raw.search,
            region: raw.region,
            startDate: raw.startDate,
            endDate: raw.endDate,
        };
    }
}
