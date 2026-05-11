import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CloseFilterDto } from '@pages/report-states/application/dto/close/close-filter.dto';
import { CloseFacade } from '@pages/report-states/application/services/close/close.facade';
import { CloseFilterControl } from '@pages/report-states/presentation/store/close/close-filter-control';
import { ReportType } from '@shared/domain/enums/report-type.enum';

@Injectable()
export class CloseFilterStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(CloseFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    readonly form: FormGroup<CloseFilterControl> =
        this.fb.group<CloseFilterControl>({
            initiatorPhoneNumber: new FormControl<string>('', {
                nonNullable: true,
            }),
            uniqId: new FormControl<string>('', {
                nonNullable: true,
            }),
            reportType: new FormControl<ReportType | null>(null, {
                nonNullable: true,
            }),
            operators: new FormControl<string[]>([], {
                nonNullable: true,
            }),
            source: new FormControl<string | null>(null, {
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

    get value(): CloseFilterDto {
        const raw = this.form.getRawValue();

        return {
            initiatorPhoneNumber: raw.initiatorPhoneNumber || undefined,
            uniqId: raw.uniqId || undefined,
            startDate: raw.startDate || undefined,
            endDate: raw.endDate || undefined,
            reportType: raw.reportType || undefined,
            source: raw.source || undefined,
            operators: raw.operators?.length ? raw.operators : undefined,
        };
    }
}
