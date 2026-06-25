import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ApproveFilterDto } from '@pages/report-states/application/dto/approve/approve-filter.dto';
import { ApproveFacade } from '@pages/report-states/application/services/approve/approve.facade';
import { ApproveFilterControl } from '@pages/report-states/presentation/store/approve/approve-filter-control';
import { ReportType } from '@shared/domain/enums/report-type.enum';

@Injectable()
export class ApproveFilterStore {
    private readonly fb = inject(FormBuilder);
    private readonly facade = inject(ApproveFacade);

    private readonly currentFilter = toSignal(this.facade.currentFilter$, {
        initialValue: null,
    });

    readonly form: FormGroup<ApproveFilterControl> =
        this.fb.group<ApproveFilterControl>({
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

    get value(): ApproveFilterDto {
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
