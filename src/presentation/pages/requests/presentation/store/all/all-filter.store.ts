import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AllFilterDto } from '@pages/requests/application/dto/all/all-filter.dto';
import { AllFacade } from '@pages/requests/application/services/all/all.facade';
import { AllFilterControl } from '@pages/requests/presentation/store/all/all-filter-control';

@Injectable()
export class AllFilterStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(AllFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    readonly form: FormGroup<AllFilterControl> =
        this.fb.group<AllFilterControl>({
            initiatorPhoneNumber: new FormControl<string>('', {
                nonNullable: true,
            }),
            uniqId: new FormControl<string>('', {
                nonNullable: true,
            }),
            reportType: new FormControl<string | null>(null, {
                nonNullable: true,
            }),
            operators: new FormControl<string[]>([], {
                nonNullable: true,
            }),
            source: new FormControl<string | null>(null, {
                nonNullable: true,
            }),
            status: new FormControl<string | null>(null, {
                nonNullable: true,
            }),
            startDate: new FormControl<string>('', {
                nonNullable: true,
            }),
            endDate: new FormControl<string>('', {
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

    get value(): AllFilterDto {
        const raw = this.form.getRawValue();

        return {
            initiatorPhoneNumber: raw.initiatorPhoneNumber || undefined,
            uniqId: raw.uniqId || undefined,
            startDate: raw.startDate || undefined,
            endDate: raw.endDate || undefined,
            reportType: raw.reportType || undefined,
            source: raw.source || undefined,
            status: raw.status || undefined,
            operators: raw.operators?.length ? raw.operators : undefined,
        };
    }
}
